export function buildLodashOrderByArgs(orderBy?: string) {
  if (!orderBy) return
  const fields = []
  const directions = []
  for (let entry of orderBy.split(',')) {
    entry = entry.trim()
    const [field, direction] = [
      entry.split(' ')[0].trim(),
      entry.split(' ')[1]?.toLowerCase().trim() || 'asc',
    ]
    fields.push(field)
    directions.push(direction)
  }
  return [fields, directions]
}
