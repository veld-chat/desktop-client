export interface ScrollInformation {
  container: boolean;
  document: boolean;
}

export function shouldScroll(element: HTMLElement) {
  return element.scrollTop >= element.scrollHeight - element.clientHeight - 100;
}
