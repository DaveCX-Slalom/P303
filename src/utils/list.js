// Order shopping-list items by the walking order of the store's sections; unknown sections go last.
export function groupBySection(items, sectionOrder) {
  const groups = new Map()
  for (const it of items) {
    const key = it.section || 'Other'
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(it)
  }
  const rank = (name) => {
    if (name === 'Other') return 1000 // items with no section always come last
    const i = sectionOrder.indexOf(name)
    return i === -1 ? 999 : i // sections this store doesn't have come just before "Other"
  }
  return [...groups.entries()].sort((a, b) => rank(a[0]) - rank(b[0]))
}
