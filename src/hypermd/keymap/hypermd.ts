// HyperMD, copyright (c) by laobubu
// Distributed under an MIT license: http://laobubu.net/HyperMD/LICENSE
//
// powerful keymap for HyperMD and Markdown modes
//

import * as CodeMirror from 'codemirror'
import { Token, Position, cmpPos } from 'codemirror'
import { cm_t } from '../core/type'
import { TokenSeeker, repeatStr, expandRange, repeat, suggestedEditorConfig } from '../core';
import { HyperMDState, TableType } from "../mode/hypermd"

/**
  Some codes in this files are from CodeMirror's source code.

  CodeMirror, copyright (c) by Marijn Haverbeke and others
  MIT license: http://codemirror.net/LICENSE

  @see codemirror\addon\edit\continuelist.js
 */

// loq = List Or Quote
const LoQRE = /^(\s*)(>[> ]*|[*+-] \[[x ]\]\s|[*+-]\s|(\d+)([.)]))(\s*)/,
  emptyLoQRE = /^(\s*)(>[> ]*|[*+-] \[[x ]\]|[*+-]|(\d+)[.)])(\s*)$/,
  unorderedListRE = /[*+-]\s/;
const ListRE = /^(\s*)([*+-]\s|(\d+)([.)]))(\s*)/;
const isRealTableSep = (token: Token) => /hmd-table-sep/.test(token.type) && !/hmd-table-sep-dummy/.test(token.type);

/**
 * continue list / quote / insert table row
 * start a table
 */
export function newlineAndContinue(cm: cm_t) {
  if (cm.getOption("disableInput")) return CodeMirror.Pass

  const selections = cm.listSelections()
  const replacements: string[] = []

  for (const range of selections) {
    const pos = range.head
    const rangeEmpty = (range as any).empty() as boolean
    const eolState = cm.getStateAfter(pos.line) as HyperMDState

    const line = cm.getLine(pos.line)

    let handled = false

    if (!handled) {
      const inList = eolState.list !== false
      const inQuote = eolState.quote
      const match = LoQRE.exec(line)
      const cursorBeforeBullet = /^\s*$/.test(line.slice(0, pos.ch))

      if (rangeEmpty && (inList || inQuote) && match && !cursorBeforeBullet) {
        handled = true

        if (emptyLoQRE.test(line)) {
          if (!/>\s*$/.test(line)) cm.replaceRange("", { line: pos.line, ch: 0 }, { line: pos.line, ch: pos.ch + 1 });
          replacements.push("\n")
        } else {
          const indent = match[1], after = match[5];
          const numbered = !(unorderedListRE.test(match[2]) || match[2].indexOf(">") >= 0)
          const bullet = numbered ? (parseInt(match[3], 10) + 1) + match[4] : match[2].replace("x", " ")
          replacements.push("\n" + indent + bullet + after)

          if (numbered) incrementRemainingMarkdownListNumbers(cm, pos);
        }
      }
    }

    if (!handled) {
      const table = rangeEmpty ? eolState.hmdTable : TableType.NONE
      if (table != TableType.NONE) {
        if (/^[\s\|]+$/.test(line) && (pos.line === cm.lastLine() || (cm.getStateAfter(pos.line + 1).hmdTable !== table))) {
          // if this is last row and is empty
          // remove this row and insert a new line
          cm.setCursor({ line: pos.line, ch: 0 })
          cm.replaceRange("\n", { line: pos.line, ch: 0 }, { line: pos.line, ch: line.length })
        } else {
          // insert a row below
          const columns = eolState.hmdTableColumns

          let newline = repeatStr("  |  ", columns.length - 1)
          let leading = "\n"
          if (table === TableType.NORMAL) {
            leading += "| "
            newline += " |"
          }

          // There are always nut users!
          if (eolState.hmdTableRow == 0) {
            cm.setCursor({ line: pos.line + 1, ch: cm.getLine(pos.line + 1).length })
          } else {
            cm.setCursor({ line: pos.line, ch: line.length })
          }

          cm.replaceSelection(leading)
          cm.replaceSelection(newline, "start")
        }

        handled = true
        return
      } else if (rangeEmpty && pos.ch >= line.length && !eolState.code && !eolState.hmdInnerMode && /^\|.+\|.+\|$/.test(line)) {
        // current line is   | this | format |
        // let's make a table
        const lineTokens = cm.getLineTokens(pos.line)
        let ans = "|", ans2 = "|"
        for (let i = 1; i < lineTokens.length; i++) { // first token must be "|"
          const token = lineTokens[i]
          if (token.string === "|" && (!token.type || !token.type.trim().length)) {
            ans += " ------- |"
            ans2 += "   |"
          }
        }

        // multi-cursor is meanless for this
        // replacements.push("\n" + ans + "\n" + ans2 + "\n")

        cm.setCursor({ line: pos.line, ch: line.length })
        cm.replaceSelection("\n" + ans + "\n| ")
        cm.replaceSelection(ans2.slice(1) + "\n", "start")
        handled = true
        return
      }
    }

    if (!handled) {
      if (rangeEmpty && line.slice(pos.ch - 2, pos.ch) == "$$" && /math-end/.test(cm.getTokenTypeAt(pos))) {
        // ignore indentations of MathBlock Tex lines
        replacements.push("\n")
        handled = true
      }
    }

    if (!handled) {
      cm.execCommand("newlineAndIndent")
      return
    }
  }

  cm.replaceSelections(replacements)
}

/** insert "\n" , or if in list, insert "\n" + indentation */
export function newline(cm: cm_t) {
  if (cm.getOption("disableInput")) return CodeMirror.Pass

  const selections = cm.listSelections()
  const replacements: string[] = repeat("\n", selections.length)

  for (let i = 0; i < selections.length; i++) {
    const range = selections[i]
    const pos = range.head
    const eolState = cm.getStateAfter(pos.line) as HyperMDState

    if (eolState.list !== false) {
      replacements[i] += repeatStr(" ", eolState.listStack.slice(-1)[0])
    }
  }

  cm.replaceSelections(replacements)
}

function killIndent(cm: cm_t, lineNo: number, spaces: number) {
  if (!spaces || spaces < 0) return
  const oldSpaces = /^ */.exec(cm.getLine(lineNo))[0].length
  if (oldSpaces < spaces) spaces = oldSpaces
  if (spaces > 0) cm.replaceRange("", { line: lineNo, ch: 0 }, { line: lineNo, ch: spaces })
}

/** unindent or move cursor into prev table cell */
export function shiftTab(cm: cm_t) {
  const selections = cm.listSelections()
  const replacements: string[] = []

  const tokenSeeker = new TokenSeeker(cm)

  for (let i = 0; i < selections.length; i++) {
    const range = selections[i]
    let left = range.head
    let right = range.anchor

    const rangeEmpty = (range as any).empty() as boolean
    if (!rangeEmpty && cmpPos(left, right) > 0) [right, left] = [left, right];
    else if (right === left) { right = range.anchor = { ch: left.ch, line: left.line }; }
    const eolState = cm.getStateAfter(left.line) as HyperMDState

    if (eolState.hmdTable) {
      tokenSeeker.setPos(left.line, left.ch)
      const isNormalTable = eolState.hmdTable === TableType.NORMAL  // leading and ending | is not omitted
      let line = left.line
      let lineText = cm.getLine(line)
      let chStart = 0, chEnd = 0
      const rightPipe = tokenSeeker.findPrev(isRealTableSep)

      if (rightPipe) { // prev cell is in this line
        const leftPipe = tokenSeeker.findPrev(isRealTableSep, rightPipe.i_token - 1)
        chStart = leftPipe ? leftPipe.token.end : 0
        chEnd = rightPipe.token.start

        if (chStart == 0 && isNormalTable) chStart += lineText.match(/^\s*\|/)[0].length
      } else { // jump to prev line, last cell
        if (eolState.hmdTableRow == 0) return // no more row before
        if (eolState.hmdTableRow == 2) line-- // skip row #1 (| ----- | ----- |)

        line--
        lineText = cm.getLine(line)
        tokenSeeker.setPos(line, lineText.length)
        const leftPipe = tokenSeeker.findPrev(isRealTableSep)
        chStart = leftPipe.token.end
        chEnd = lineText.length

        if (isNormalTable) chEnd -= lineText.match(/\|\s*$/)[0].length
      }

      if (lineText.charAt(chStart) === " ") chStart += 1
      if (chStart > 0 && lineText.substr(chStart - 1, 2) === ' |') chStart--
      if (lineText.charAt(chEnd - 1) === " ") chEnd -= 1

      cm.setSelection({ line, ch: chStart }, { line, ch: chEnd })
      return
    } else if (eolState.listStack.length > 0) {
      let lineNo = left.line

      while (!ListRE.test(cm.getLine(lineNo))) { // beginning line has no bullet? go up
        lineNo--
        const isList = cm.getStateAfter(lineNo).listStack.length > 0
        if (!isList) { lineNo++; break }
      }

      const lastLine = cm.lastLine()
      let tmp: RegExpExecArray

      for (; lineNo <= right.line && (tmp = ListRE.exec(cm.getLine(lineNo))); lineNo++) {
        const listStack = cm.getStateAfter(lineNo).listStack as number[]
        const listLevel = listStack.length

        let spaces = 0
        if (listLevel == 1) {
          // maybe user wants to trimLeft?
          spaces = tmp[1].length
        } else {
          // make bullets right-aligned
          spaces = (listStack[listLevel - 1] - (listStack[listLevel - 2] || 0))
        }

        killIndent(cm, lineNo, spaces)

        // if current list item is multi-line...
        while (++lineNo <= lastLine) {
          if (/*corrupted */ cm.getStateAfter(lineNo).listStack.length !== listLevel) { lineNo = Infinity; break }
          if (/*has bullet*/ ListRE.test(cm.getLine(lineNo))) { lineNo--; break }
          killIndent(cm, lineNo, spaces)
        }
      }

      return
    }
  }

  cm.execCommand("indentLess")
}

/**
 * 1. for tables, move cursor into next table cell, and maybe insert a cell
 * 2.
 */
export function tab(cm: cm_t) {
  const selections = cm.listSelections()
  const beforeCur: string[] = []
  const afterCur: string[] = []
  const selected: string[] = []

  const addIndentTo: Record<string, string> = {}  // {lineNo: stringIndent}

  const tokenSeeker = new TokenSeeker(cm)

  /** indicate previous 4 variable changed or not */
  let flag0 = false, flag1 = false, flag2 = false, flag3 = true
  let i = 0;

  function setBeforeCur(text) { beforeCur[i] = text; if (text) flag1 = true }
  function setAfterCur(text) { afterCur[i] = text; if (text) flag2 = true }
  function setSelected(text) { selected[i] = text; if (text) flag3 = true }

  for (; i < selections.length; i++) {
    beforeCur[i] = afterCur[i] = selected[i] = ""

    const range = selections[i]
    let left = range.head
    let right = range.anchor

    const rangeEmpty = (range as any).empty() as boolean
    if (!rangeEmpty && cmpPos(left, right) > 0) [right, left] = [left, right];
    else if (right === left) { right = range.anchor = { ch: left.ch, line: left.line }; }

    const eolState = cm.getStateAfter(left.line) as HyperMDState

    const line = cm.getLine(left.line)

    if (eolState.hmdTable) {
      // yeah, we are inside a table

      flag0 = true // cursor will move

      const isNormalTable = eolState.hmdTable === TableType.NORMAL
      const columns = eolState.hmdTableColumns

      tokenSeeker.setPos(left.line, left.ch)

      const nextCellLeft = tokenSeeker.findNext(isRealTableSep, tokenSeeker.i_token)
      if (!nextCellLeft) { // already last cell
        const lineSpan = eolState.hmdTableRow === 0 ? 2 : 1 // skip |---|---| line

        if ((left.line + lineSpan) > cm.lastLine() || cm.getStateAfter(left.line + lineSpan).hmdTable != eolState.hmdTable) {
          // insert a row after this line
          left.ch = right.ch = line.length
          const newline = repeatStr("  |  ", columns.length - 1)

          // There are always nut users!
          if (eolState.hmdTableRow === 0) {
            right.line = left.line += 1
            right.ch = left.ch = cm.getLine(left.line).length
          }

          if (isNormalTable) {
            setBeforeCur("\n| ")
            setAfterCur(newline + " |")
          } else {
            setBeforeCur("\n")
            setAfterCur(newline.trimRight())
          }
          setSelected("")
        } else {
          // move cursor to next line, first cell
          right.line = left.line += lineSpan
          tokenSeeker.setPos(left.line, 0)

          const line = tokenSeeker.line.text
          const dummySep = isNormalTable && tokenSeeker.findNext(/hmd-table-sep-dummy/, 0)
          const nextCellRight = tokenSeeker.findNext(/hmd-table-sep/, dummySep ? dummySep.i_token + 1 : 1)

          left.ch = dummySep ? dummySep.token.end : 0
          right.ch = nextCellRight ? nextCellRight.token.start : line.length
          if (right.ch > left.ch && line.charAt(left.ch) === " ") left.ch++
          if (right.ch > left.ch && line.charAt(right.ch - 1) === " ") right.ch--
          setSelected(right.ch > left.ch ? cm.getRange(left, right) : "")
        }
      } else {
        const nextCellRight = tokenSeeker.findNext(/hmd-table-sep/, nextCellLeft.i_token + 1)

        left.ch = nextCellLeft.token.end
        right.ch = nextCellRight ? nextCellRight.token.start : line.length
        if (right.ch > left.ch && line.charAt(left.ch) === " ") left.ch++
        if (right.ch > left.ch && line.charAt(right.ch - 1) === " ") right.ch--
        setSelected(right.ch > left.ch ? cm.getRange(left, right) : "")
      }
      // console.log("selected cell", left.ch, right.ch, selected[i])
    } else if (eolState.listStack.length > 0) {
      // add indent to current line
      let lineNo = left.line

      let tmp: RegExpMatchArray // ["  * ", "  ", "* "]

      while (!(tmp = ListRE.exec(cm.getLine(lineNo)))) { // beginning line has no bullet? go up
        lineNo--
        const isList = cm.getStateAfter(lineNo).listStack.length > 0
        if (!isList) { lineNo++; break }
      }

      const firstLine = cm.firstLine()
      const lastLine = cm.lastLine()

      for (; lineNo <= right.line && (tmp = ListRE.exec(cm.getLine(lineNo))); lineNo++) {
        const eolState = cm.getStateAfter(lineNo) as HyperMDState
        const listStack = eolState.listStack
        const listStackOfPrevLine = cm.getStateAfter(lineNo - 1).listStack
        const listLevel = listStack.length
        let spaces = ""

        // avoid uncontinuous list levels
        if (lineNo > firstLine && listLevel <= listStackOfPrevLine.length) {
          if (listLevel == listStackOfPrevLine.length) {
            // tmp[1] is existed leading spaces
            // listStackOfPrevLine[listLevel-1] is desired indentation
            spaces = repeatStr(" ", listStackOfPrevLine[listLevel - 1] - tmp[1].length)
          } else {
            // make bullets right-aligned
            // tmp[0].length is end pos of current bullet
            spaces = repeatStr(" ", listStackOfPrevLine[listLevel] - tmp[0].length)
          }
        }

        addIndentTo[lineNo] = spaces

        // if current list item is multi-line...
        while (++lineNo <= lastLine) {
          if (/*corrupted */ cm.getStateAfter(lineNo).listStack.length !== listLevel) { lineNo = Infinity; break }
          if (/*has bullet*/ ListRE.test(cm.getLine(lineNo))) { lineNo--; break }
          addIndentTo[lineNo] = spaces
        }
      }

      if (!rangeEmpty) {
        flag3 = false; break // f**k
      }
    } else {
      // emulate Tab
      if (rangeEmpty) {
        setBeforeCur("    ")
      } else {
        setSelected(cm.getRange(left, right))
        for (let lineNo = left.line; lineNo <= right.line; lineNo++) {
          if (!(lineNo in addIndentTo)) addIndentTo[lineNo] = "    "
        }
      }
    }
  }

  // if (!(flag0 || flag1 || flag2 || flag3)) return cm.execCommand("defaultTab")
  // console.log(flag0, flag1, flag2, flag3)

  for (const lineNo in addIndentTo) {
    if (addIndentTo[lineNo]) cm.replaceRange(addIndentTo[lineNo], { line: ~~lineNo, ch: 0 });
  }
  if (flag0) cm.setSelections(selections)
  if (flag1) cm.replaceSelections(beforeCur)
  if (flag2) cm.replaceSelections(afterCur, "start")
  if (flag3) cm.replaceSelections(selected, "around")
}

/**
 * add / delete bracket pair to every selections,
 * or just add left bracket to cursor if nothing selected.
 *
 * This provides a `createStyleToggler`-like feature,
 * but don't rely on HyperMD mode
 *
 * @example
 *     When brackets are "(" and ")" :
 *     (Hello) => Hello   (Selected "(Hello)" or just "Hello")
 *     Hello   => (Hello)
 *
 * @param rightBracket if null, will use leftBracket
 */
export function wrapTexts(cm: cm_t, leftBracket: string, rightBracket?: string) {
  if (cm.getOption("disableInput")) return CodeMirror.Pass

  const selections = cm.listSelections()
  const replacements = new Array(selections.length)
  const insertBeforeCursor = new Array(selections.length)

  let flag0 = false  // replacements changed
  let flag1 = false  // insertBeforeCursor changed
  let flag2 = false  // selections changed

  if (!rightBracket) rightBracket = leftBracket

  const lb_len = leftBracket.length
  const rb_len = rightBracket.length

  for (let i = 0; i < selections.length; i++) {
    replacements[i] = insertBeforeCursor[i] = ""

    const range = selections[i]
    let left = range.head
    let right = range.anchor

    const line = cm.getLine(left.line)

    if (range.empty()) {
      if (left.ch >= lb_len && line.substr(left.ch - lb_len, lb_len) === leftBracket) {
        // wipe out the left bracket
        flag2 = true
        left.ch -= lb_len
      } else {
        // insert left bracket
        flag1 = true
        insertBeforeCursor[i] = leftBracket
      }
      continue
    }

    flag0 = true

    const headAfterAnchor = cmpPos(left, right) > 0
    if (headAfterAnchor) [right, left] = [left, right]

    let text = cm.getRange(left, right)

    if (left.ch >= lb_len && left.line === right.line) {
      if (line.substr(left.ch - lb_len, lb_len) === leftBracket && line.substr(right.ch, rb_len) === rightBracket) {
        flag2 = true

        right.ch += rb_len
        left.ch -= lb_len

        text = leftBracket + text + rightBracket
      }
    }

    if (text.slice(0, lb_len) === leftBracket && text.slice(-rb_len) === rightBracket) {
      replacements[i] = text.slice(lb_len, -rb_len)
    } else {
      replacements[i] = leftBracket + text + rightBracket
    }
  }

  if (flag2) cm.setSelections(selections)
  if (flag1) cm.replaceSelections(insertBeforeCursor)
  if (flag0) cm.replaceSelections(replacements, "around")
}

export function createStyleToggler(
  isStyled: (state) => boolean,
  isFormattingToken: (token: Token) => boolean,
  getFormattingText: (state?) => string
) {
  return function (cm: cm_t) {
    if (cm.getOption("disableInput")) return CodeMirror.Pass

    const ts = new TokenSeeker(cm)
    const selections = cm.listSelections()
    const replacements = new Array(selections.length)

    for (let i = 0; i < selections.length; i++) {
      const range = selections[i]
      let left = range.head
      let right = range.anchor
      const eolState = cm.getStateAfter(left.line)
      const rangeEmpty = (range as any).empty() as boolean

      if (cmpPos(left, right) > 0) [right, left] = [left, right];
      const rangeText = replacements[i] = rangeEmpty ? "" : cm.getRange(left, right)

      if (rangeEmpty || isStyled(cm.getTokenAt(left).state)) { // nothing selected
        const line = left.line
        ts.setPos(line, left.ch, true)
        let token = ts.lineTokens[ts.i_token]
        const state: HyperMDState = token ? token.state : eolState

        if (!token || /^\s*$/.test(token.string)) {
          token = ts.lineTokens[--ts.i_token] // maybe eol, or current token is space
        }

        const { from, to } = ts.expandRange((token) => token && (isStyled(token.state) || isFormattingToken(token)))

        if (to.i_token === from.i_token) { // current token "word" is not formatted
          const f = getFormattingText()
          if (token && !/^\s*$/.test(token.string)) { // not empty line, not spaces
            const pos1 = { line, ch: token.start }, pos2 = { line, ch: token.end }
            token = from.token
            cm.replaceRange(f + token.string + f, pos1, pos2)

            pos2.ch += f.length
            cm.setCursor(pos2)
            return
          } else {
            replacements[i] = f
          }
        } else { // **wor|d**    **|**   **word|  **|
          if (isFormattingToken(to.token)) {
            cm.replaceRange("", { line, ch: to.token.start }, { line, ch: to.token.end })
          }
          if (from.i_token !== to.i_token && isFormattingToken(from.token)) {
            cm.replaceRange("", { line, ch: from.token.start }, { line, ch: from.token.end })
          }
        }
        continue
      }

      const token = cm.getTokenAt(left)
      const state = token ? token.state : eolState
      const formatter = getFormattingText(state)
      replacements[i] = formatter + rangeText + formatter
    }

    cm.replaceSelections(replacements)
  }
}

// Auto-updating Markdown list numbers when a new item is added to the
// middle of a list
function incrementRemainingMarkdownListNumbers(cm, pos) {
  const listRE = LoQRE
  const startLine = pos.line;
  let lookAhead = 0;
  let skipCount = 0;
  const startItem = listRE.exec(cm.getLine(startLine)), startIndent = startItem[1];

  let nextItem;

  do {
    lookAhead += 1;
    const nextLineNumber = startLine + lookAhead;
    const nextLine = cm.getLine(nextLineNumber);
    nextItem = listRE.exec(nextLine);

    if (nextItem) {
      const nextIndent = nextItem[1];
      const newNumber = (parseInt(startItem[3], 10) + lookAhead - skipCount);
      const nextNumber = (parseInt(nextItem[3], 10));
      let itemNumber = nextNumber;

      if (startIndent === nextIndent && !isNaN(nextNumber)) {
        if (newNumber === nextNumber) itemNumber = nextNumber + 1;
        if (newNumber > nextNumber) itemNumber = newNumber + 1;
        cm.replaceRange(
          nextLine.replace(listRE, nextIndent + itemNumber + nextItem[4] + nextItem[5]),
          {
            line: nextLineNumber, ch: 0
          }, {
            line: nextLineNumber, ch: nextLine.length
          });
      } else {
        if (startIndent.length > nextIndent.length) return;
        // This doesn't run if the next line immediatley indents, as it is
        // not clear of the users intention (new indented item or same level)
        if ((startIndent.length < nextIndent.length) && (lookAhead === 1)) return;
        skipCount += 1;
      }
    }
  } while (nextItem);
}

Object.assign(CodeMirror.commands, {
  hmdNewlineAndContinue: newlineAndContinue,
  hmdNewline: newline,
  hmdShiftTab: shiftTab,
  hmdTab: tab,
})

const defaultKeyMap = CodeMirror.keyMap["default"]
const modPrefix = defaultKeyMap === CodeMirror.keyMap["macDefault"] ? "Cmd" : "Ctrl"
const keyMap: CodeMirror.KeyMap = {
  "Shift-Tab": "hmdShiftTab",
  "Tab": "hmdTab",
  "Enter": "hmdNewlineAndContinue",
  "Shift-Enter": "hmdNewline",

  [`${modPrefix}-B`]: createStyleToggler(
    state => state.strong,
    token => / formatting-strong /.test(token.type),
    state => repeatStr(state && state.strong || "*", 2)     // ** or __
  ),
  [`${modPrefix}-I`]: createStyleToggler(
    state => state.em,
    token => / formatting-em /.test(token.type),
    state => (state && state.em || "*")
  ),
  [`${modPrefix}-D`]: createStyleToggler(
    state => state.strikethrough,
    token => / formatting-strikethrough /.test(token.type),
    state => "~~"
  ),


  fallthrough: "default",
}

CodeMirror.keyMap["hypermd"] = CodeMirror.normalizeKeyMap(keyMap)
suggestedEditorConfig.keyMap = "hypermd"
