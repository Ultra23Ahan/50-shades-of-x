import nearestColor from 'nearest-color';
import {colornames} from 'color-name-list';

const colorMap = colornames.reduce(
  (acc, { name, hex }) => {
    acc[name] = hex;
    return acc;
  },
  {} as Record<string, string>,
);

const nearest = nearestColor.from(colorMap);

export function getColorName(hex: string): string {
  return nearest(hex).name;
}
