export function next(current: number, limit: number) {
  return (current + 1) % limit;
}

export function prev(current: number, limit: number) {
  if (current < 0) return limit - 1;
  return (current - 1 + limit) % limit;
}

export function getActiveIndex(nodes: NodeListOf<Element>) {
  return Array.from(nodes).findIndex((item) =>
    item.hasAttribute("data-active"),
  );
}

export function setActiveIndex(
  nodes: NodeListOf<Element>,
  currentIndex: number,
  nextIndex: number,
) {
  if (currentIndex >= 0) nodes[currentIndex].removeAttribute("data-active");
  nodes[nextIndex].setAttribute("data-active", "");

  return nextIndex;
}
