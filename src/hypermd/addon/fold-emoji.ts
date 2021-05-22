// HyperMD, copyright (c) by laobubu
// Distributed under an MIT license: http://laobubu.net/HyperMD/LICENSE
//
// DESCRIPTION: Fold and render emoji :smile:
//

import * as CodeMirror from 'codemirror'
import { Position } from 'codemirror'
import { Addon, suggestedEditorConfig } from '../core'
import { cm_t } from '../core/type'
import { breakMark, FolderFunc, registerFolder, RequestRangeResult } from './fold'
import { store } from "@/store";

/********************************************************************************** */

export type EmojiRenderer = (text: string) => HTMLElement;
export type EmojiChecker = (text: string) => boolean;

export const defaultChecker: EmojiChecker = (text) => text in store.state.emoji.emojisByValue
export const defaultRenderer: EmojiRenderer = (text) => {
  const ans = document.createElement("img")
  ans.setAttribute("src",  store.state.emoji.emojisByValue[text].image);
  return ans
}

/********************************************************************************** */
//#region Folder
/**
 * Detect if a token is emoji and fold it
 *
 * @see FolderFunc in ./fold.ts
 */
export const EmojiFolder: FolderFunc = (stream, token) => {
  if (!token.type || !/ formatting-emoji/.test(token.type)) return null

  const cm = stream.cm
  const from: Position = { line: stream.lineNo, ch: token.start }
  const to: Position = { line: stream.lineNo, ch: token.end }

  const name = token.string // with ":"
  const addon = getAddon(cm)
  if (!addon.isEmoji(name)) return null

  const reqAns = stream.requestRange(from, to)
  if (reqAns !== RequestRangeResult.OK) return null

  // now we are ready to fold and render!

  return addon.foldEmoji(name, from, to)
}
//#endregion

registerFolder("emoji", EmojiFolder, true)

/********************************************************************************** */
//#region Addon Options

export interface Options extends Addon.AddonOptions {
  /**
   * you may add your custom emojis, which have higher priority than standard emojis
   *
   * @example { ":doge:": a_function_that_creates_doge_img_element }
   */
  myEmoji: { [name: string]: EmojiRenderer }

  /**
   * Tired of plain text? You may provide a EmojiRenderer function,
   * which generates a HTML Element (eg. emoji image from twemoji or emojione)
   * for standard emojis.
   *
   * Note that if EmojiRenderer returns null, the folding process will be aborted.
   */
  emojiRenderer: EmojiRenderer

  /**
   * Check if a emoji text , eg. `:smile:` , is valid
   */
  emojiChecker: EmojiChecker
}

export const defaultOption: Options = {
  myEmoji: {},
  emojiRenderer: defaultRenderer,
  emojiChecker: defaultChecker,
}

export const suggestedOption: Partial<Options> = {

}

export type OptionValueType = Partial<Options>;

declare global {
  namespace HyperMD {
    interface EditorConfiguration {
      /**
       * **NOTE**: to stop folding emojis, please modify `hmdFold.emoji` instead.
       *
       * `hmdFoldEmoji` is options for EmojiFolder, which also accepts
       *
       * - **EmojiRenderer** function
       * - **string**: name of a emoji renderer (see emojiRenderer)
       */
      hmdFoldEmoji?: OptionValueType
    }
  }
}

suggestedEditorConfig.hmdFoldEmoji = suggestedOption

CodeMirror.defineOption("hmdFoldEmoji", defaultOption, function (cm: cm_t, newVal: OptionValueType) {

  ///// convert newVal's type to `Partial<Options>`, if it is not.

  if (!newVal) { newVal = {} }

  ///// apply config and write new values into cm

  const inst = getAddon(cm)
  for (const k in defaultOption) {
    inst[k] = (k in newVal) ? newVal[k] : defaultOption[k]
  }
})

//#endregion

/********************************************************************************** */
//#region Addon Class

export class FoldEmoji implements Addon.Addon, Options {
  myEmoji: { [name: string]: EmojiRenderer; };
  emojiRenderer: EmojiRenderer;
  emojiChecker: EmojiChecker;

  constructor(public cm: cm_t) {
    // options will be initialized to defaultOption when constructor is finished
  }

  isEmoji(text: string) {
    return text in this.myEmoji || this.emojiChecker(text)
  }

  foldEmoji(text: string, from: CodeMirror.Position, to: CodeMirror.Position) {
    const cm = this.cm
    const el = ((text in this.myEmoji) && this.myEmoji[text](text)) || this.emojiRenderer(text)

    if (!el || !el.tagName) return null
    if (el.className.indexOf('hmd-emoji') === -1) el.className += " hmd-emoji"

    const marker = cm.markText(from, to, {
      replacedWith: el,
    })

    el.addEventListener("click", breakMark.bind(this, cm, marker, 1), false)

    if (el.tagName.toLowerCase() === 'img') {
      el.addEventListener('load', () => marker.changed(), false)
      el.addEventListener('dragstart', (ev) => ev.preventDefault(), false)
    }

    return marker
  }
}

//#endregion

/** ADDON GETTER (Singleton Pattern): a editor can have only one FoldEmoji instance */
export const getAddon = Addon.Getter("FoldEmoji", FoldEmoji, defaultOption /** if has options */)
declare global { namespace HyperMD { interface HelperCollection { FoldEmoji?: FoldEmoji } } }

