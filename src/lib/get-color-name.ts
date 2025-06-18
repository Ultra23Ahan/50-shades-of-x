import nearestColor from 'nearest-color';
import { colornames } from 'color-name-list';

const typedColornames = colornames as { name: string; hex: string }[];

const colorMap = typedColornames.reduce<Record<string, string>>(
  (acc, { name, hex }) => {
    acc[name] = hex;
    return acc;
  },
  {},
);

const nearest = nearestColor.from(colorMap);

export function getColorName(hex: string): string {
  return nearest(hex).name;
}
