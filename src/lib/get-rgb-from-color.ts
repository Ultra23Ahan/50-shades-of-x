export function getRGBFromColor(
  color: string,
): [number, number, number] | null {
  const temp = document.createElement('div');
  temp.style.color = color;
  document.body.appendChild(temp);

  const computedColor = getComputedStyle(temp).color;
  document.body.removeChild(temp);

  const match = computedColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (!match) return null;

  return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
}
