'use client';
import { useState, useRef, useEffect } from 'react';
import { useCopyToClipboard } from '@/lib/hooks/use-copy-to-clipboard';
import * as React from 'react';

type ColorNameSegmentProps = {
  color: string;
  textColor: string;
};

export function ColorNameSegment({ color, textColor }: ColorNameSegmentProps) {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const [minWidth, setMinWidth] = useState<number | undefined>(undefined);
  const [useless, copyToClipboard] = useCopyToClipboard();
  // useless is just to make the hook work and to avoid linting errors
  // Measure width of original content
  useEffect(() => {
    if (textRef.current) {
      setMinWidth(textRef.current.offsetWidth);
    }
  }, []);

  // Reset clicked state after 0.5s
  useEffect(() => {
    if (clicked) {
      const timer = setTimeout(() => {
        setClicked(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [clicked]);

  return (
    <div
      className={`mt-5 flex cursor-pointer flex-row flex-wrap gap-2 rounded-xl border border-[${textColor}] px-6 py-4 text-2xl font-bold transition-colors duration-200 select-none useless-${useless}`}
      style={{
        color: hovered ? color : textColor,
        minWidth: minWidth ? `${minWidth}px` : 'auto',
        backgroundColor: hovered ? textColor : 'transparent',
        borderColor: textColor,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        copyToClipboard(color);
        setClicked(true);
      }}
    >
      {clicked ? (
        <div
          className="flex items-center justify-center gap-1 select-none"
          style={{ width: minWidth ? `${minWidth}px` : 'auto' }}
        >
          <span>Copied</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            enableBackground="new 0 0 64 64"
            fill="currentColor"
            className="w-7"
          >
            <path d="M32,2C15.431,2,2,15.432,2,32c0,16.568,13.432,30,30,30c16.568,0,30-13.432,30-30C62,15.432,48.568,2,32,2z M25.025,50l-0.02-0.02L24.988,50L11,35.6l7.029-7.164l6.977,7.184l21-21.619L53,21.199L25.025,50z" />
          </svg>
        </div>
      ) : (
        <div ref={textRef}>{color}</div>
      )}
    </div>
  );
}
