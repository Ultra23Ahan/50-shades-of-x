'use client';
import * as React from 'react';

function oldSchoolCopy(text: string) {
  const tempTextArea = document.createElement('textarea');
  tempTextArea.value = text;
  document.body.appendChild(tempTextArea);
  tempTextArea.select();
  document.execCommand('copy');
  document.body.removeChild(tempTextArea);
}

export function useCopyToClipboard(): [string | null, (value: string) => void] {
  const [state, setState] = React.useState<string | null>(null);

  const copyToClipboard = React.useCallback((value: string) => {
    const handleCopy = async () => {
      try {
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(value);
          setState(value);
        } else {
          throw new Error('navigator.clipboard.writeText not supported');
        }
      } catch (e) {
        console.error(e);
        oldSchoolCopy(value);
        setState(value);
      }
    };

    handleCopy();
  }, []);

  return [state, copyToClipboard];
}
