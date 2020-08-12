export function find<T>(items: Iterable<T>, filter: (item: T) => boolean): T | null {
  for (const item of items) {
    if (filter(item)) {
      return item
    }
  }

  return null;
}

export function selectMany<TIn, TOut>(input: TIn[], selectListFn: (t: TIn) => TOut[]): TOut[] {
  return input.reduce((out, inx) => {
    out.push(...selectListFn(inx));
    return out;
  }, new Array<TOut>());
}
