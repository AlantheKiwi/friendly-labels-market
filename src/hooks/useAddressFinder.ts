
import { useEffect, useRef } from "react";

// Define the window type with AddressFinder
declare global {
  interface Window {
    AddressFinder: any;
  }
}

interface UseAddressFinderProps {
  inputRef: React.RefObject<HTMLInputElement>;
  apiKey: string;
  country?: 'NZ' | 'AU';
  onAddressSelected?: (address: any, metaData: any) => void;
}

export const useAddressFinder = ({
  inputRef,
  apiKey,
  country = 'NZ',
  onAddressSelected
}: UseAddressFinderProps) => {
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    // Don't initialize if input ref is not available
    if (!inputRef.current) return;

    // Check if the script is already loaded
    if (!scriptRef.current) {
      const script = document.createElement("script");
      script.src = "https://api.addressfinder.io/assets/v3/addressfinder.js";
      script.async = true;
      scriptRef.current = script;

      script.onload = initializeWidget;
      document.body.appendChild(script);
    } else {
      initializeWidget();
    }

    function initializeWidget() {
      if (window.AddressFinder && inputRef.current && !widgetRef.current) {
        const widget = new window.AddressFinder.Widget(
          inputRef.current,
          apiKey,
          country
        );

        if (onAddressSelected) {
          widget.on("result:select", (fullAddress: any, metaData: any) => {
            onAddressSelected(fullAddress, metaData);
          });
        }

        widgetRef.current = widget;
      }
    }

    return () => {
      // Cleanup widget when component unmounts
      if (widgetRef.current) {
        widgetRef.current.destroy?.();
        widgetRef.current = null;
      }
    };
  }, [inputRef, apiKey, country, onAddressSelected]);

  return widgetRef.current;
};
