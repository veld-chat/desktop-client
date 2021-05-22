declare namespace CodeMirror {
  let keyMap: CodeMirror.KeyMap;

  interface Editor {
    getOption(option: string): any;
    setOption(option: string, value: any): void;
  }
}
