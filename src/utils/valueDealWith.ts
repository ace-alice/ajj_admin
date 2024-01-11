export function emptyData(value: any, tag: string = '--') {
  if (!!value || value == 0 || value === false) {
    return value;
  } else {
    return tag;
  }
}
