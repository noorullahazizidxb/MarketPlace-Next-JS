export type CategoryNode = { id: number | string; parentId?: number | string | null; name?: string; slug?: string; isActive?: boolean };

/** Top-level, active categories (parentId empty). */
export function rootCategories<T extends CategoryNode>(categories: T[]): T[] {
  return categories.filter((c) => (c.parentId === null || c.parentId === undefined) && c.isActive !== false);
}

/** The category id plus all of its descendants' ids (as strings), so a parent filter includes sub-categories. */
export function categoryWithDescendants(categories: CategoryNode[], id: string | number): Set<string> {
  const byParent = new Map<string, string[]>();
  for (const c of categories) {
    if (c.parentId === null || c.parentId === undefined) continue;
    const key = String(c.parentId);
    byParent.set(key, [...(byParent.get(key) ?? []), String(c.id)]);
  }
  const out = new Set<string>();
  const stack = [String(id)];
  while (stack.length) {
    const cur = stack.pop()!;
    if (out.has(cur)) continue;
    out.add(cur);
    stack.push(...(byParent.get(cur) ?? []));
  }
  return out;
}
