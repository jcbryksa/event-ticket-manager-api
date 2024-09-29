export function pagination<T>(itemsArray: T[], page: number, limit: number) {
  return itemsArray.slice((page - 1) * limit, page * limit)
}
