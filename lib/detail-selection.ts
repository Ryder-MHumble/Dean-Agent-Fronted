export function getDefaultDetailSelection<T>(
  items: readonly T[],
  selectedItem: T | null,
  getKey: (item: T) => string,
  autoOpen: boolean,
  preserveSelectedOutsideItems = false,
): T | null {
  if (selectedItem && preserveSelectedOutsideItems) {
    return selectedItem;
  }

  if (items.length === 0) return null;

  if (
    selectedItem &&
    items.some((item) => getKey(item) === getKey(selectedItem))
  ) {
    return selectedItem;
  }

  return autoOpen ? items[0] : null;
}
