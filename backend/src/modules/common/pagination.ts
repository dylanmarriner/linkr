export function parsePagination(query: Record<string, unknown>, defaultTake = 20) {
  const take = Math.min(Math.max(Number(query.take) || defaultTake, 1), 100);
  const skip = Math.max(Number(query.skip) || 0, 0);
  return { take, skip };
}
