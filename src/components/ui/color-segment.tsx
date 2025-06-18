import { getColorName } from '@/lib/get-color-name';
import * as converters from '@/lib/converters';
import { ColorNameSegment } from '@/components/ui/color-name-segment';

type ColorSegmentProps = {
  color: string;
  textColor: string;
};

export function ColorSegment({ color, textColor }: ColorSegmentProps) {
  const colorName =
    getColorName(converters.convertToHEX(color)) ||
    "Not named yet!(not my problem its github/meodai/color-names's problem)";
  const rgbColor = converters.convertToRGB(color);
  const hslColor = color; // hsl by default
  const hexColor = converters.convertToHEX(color);
  const oklchColor = converters.convertToOKLCH(color);

  return (
    <>
      <div
        className="flex h-screen w-screen snap-center flex-col items-center justify-center"
        style={{ backgroundColor: color, color: textColor }}
      >
        <div className="flex flex-col">
          <span className="mb-10 flex-grow text-center text-6xl font-bold">
            {colorName}
          </span>
        </div>
        <div className="flex w-fit flex-row flex-wrap gap-2">
          <ColorNameSegment color={hexColor} textColor={textColor} />
          <ColorNameSegment color={oklchColor} textColor={textColor} />
        </div>
        <div className="flex w-fit flex-row flex-wrap gap-2">
          <ColorNameSegment color={rgbColor} textColor={textColor} />
          <ColorNameSegment color={hslColor} textColor={textColor} />
        </div>
      </div>
    </>
  );
}
