'use client';
import { useEffect, useState, useRef } from 'react';
import { getLuminance } from '@/lib/get-luminance';
import { getRGBFromColor } from '@/lib/get-rgb-from-color';
import { ColorSegment } from '@/components/ui/color-segment';

export default function Home() {
  const [color, setColor] = useState<string>('');
  const [baseTextColor, setBaseTextColor] = useState<string>('black');
  const [isValidColor, setIsValidColor] = useState<boolean>(false);
  const [lighterShades, setLighterShades] = useState<string[]>([]);
  const [darkerShades, setDarkerShades] = useState<string[]>([]);
  const inputRef = useRef<HTMLDivElement | null>(null);

  function getContrastColor(rgb: [number, number, number]): string {
    const luminance = getLuminance(...rgb);
    return luminance < 0.5 ? 'white' : 'black';
  }

  useEffect(() => {
    const input = document.getElementById('colorInput') as HTMLInputElement;
    input.focus();

    const handleInput = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const newColor = target.value.trim().toLowerCase();
      setColor(newColor);

      const rgb = getRGBFromColor(newColor);
      if (rgb) {
        const luminance = getLuminance(...rgb);
        const baseText = luminance < 0.5 ? 'white' : 'black';
        setBaseTextColor(baseText);
        setIsValidColor(true);

        // Convert to HSL
        const [r, g, b] = rgb.map((v) => v / 255);
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0;
        let s = 0;
        const l = (max + min) / 2;

        if (max !== min) {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch (max) {
            case r:
              h = (g - b) / d + (g < b ? 6 : 0);
              break;
            case g:
              h = (b - r) / d + 2;
              break;
            case b:
              h = (r - g) / d + 4;
              break;
          }
          h /= 6;
        }

        // Helper to convert to HSL string
        const toHslString = (h: number, s: number, l: number) =>
          `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;

        // Generate lighter shades: l -> 1.0
        const lighter = Array.from({ length: 24 }, (_, i) => {
          const lightness = l + ((1 - l) * (i + 1)) / 24;
          return toHslString(h, s, Math.min(1, lightness));
        });

        // Generate darker shades: l -> 0
        const darker = Array.from({ length: 25 }, (_, i) => {
          const lightness = l - (l * (i + 1)) / 25;
          return toHslString(h, s, Math.max(0, lightness));
        });

        setLighterShades(lighter.reverse());
        setDarkerShades(darker);
      } else {
        setIsValidColor(false);
        setBaseTextColor('black');
        setColor('#f3f4f6');
        setLighterShades([]);
        setDarkerShades([]);
      }
      setTimeout(() => {
        inputRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 100);
    };

    input.addEventListener('input', handleInput);
    return () => input.removeEventListener('input', handleInput);
  }, []);

  return (
    <div className="flex w-screen snap-y snap-mandatory flex-col overflow-y-auto">
      {/* Lighter Shades */}
      {lighterShades.map((shade, index) => {
        const rgb = getRGBFromColor(shade);
        const text = rgb ? getContrastColor(rgb) : 'black';
        return (
          <div key={`light-${index}`}>
            <ColorSegment color={shade} textColor={text} />
          </div>
        );
      })}

      {/* Input Section */}
      <div
        className="relative flex min-h-screen w-full snap-center items-center justify-center gap-4 overflow-y-auto px-4 py-8 transition-colors duration-300"
        style={{
          backgroundColor: color && isValidColor ? color : '',
          color: baseTextColor,
        }}
      >
        <div
          className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-row gap-2"
          ref={inputRef}
        >
          <h1 className="rounded-md py-1 text-5xl">50 Shades Of:</h1>
          <input
            type="text"
            name="color"
            id="colorInput"
            placeholder="Red"
            className="w-50 rounded-lg border-0 bg-[#f3f4f6] px-2 py-0.5 text-5xl text-black ring-0 outline-0 placeholder:text-red-500/30"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
        </div>
      </div>

      {/* Darker Shades */}
      {darkerShades.map((shade, index) => {
        const rgb = getRGBFromColor(shade);
        const text = rgb ? getContrastColor(rgb) : 'white';
        return (
          <div key={`dark-${index}`}>
            <ColorSegment color={shade} textColor={text} />
          </div>
        );
      })}
    </div>
  );
}
