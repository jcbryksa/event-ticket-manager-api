export function contains(source: string, substr: string) {
  return new RegExp(substr, 'i').test(source)
}
