import { useEffect } from "react";

/**
 * Hook to trigger MathJax re-rendering when content changes
 */
export const useMathJax = (dependencies: any[] = []) => {
  useEffect(() => {
    const typeset = () => {
      if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise()
          .then(() => {
            console.log("MathJax typeset complete");
          })
          .catch((err: any) => console.error("MathJax typeset failed:", err));
      }
    };

    // Small delay to ensure DOM is updated
    const timer = setTimeout(typeset, 100);

    return () => clearTimeout(timer);
  }, dependencies);
};

/**
 * Manually trigger MathJax typesetting for a specific element
 */
export const typesetMath = (elementId?: string) => {
  if (!window.MathJax) return;

  const element = elementId
    ? document.getElementById(elementId)
    : document.body;

  if (window.MathJax.typesetPromise) {
    window.MathJax.typesetPromise([element]).catch((err: any) =>
      console.error("MathJax typeset error:", err)
    );
  }
};

// Type declaration for MathJax
declare global {
  interface Window {
    MathJax: {
      typesetPromise: (elements?: any[]) => Promise<void>;
      tex2chtml: (tex: string, options?: any) => any;
      startup: {
        defaultPageReady: () => Promise<void>;
      };
    };
  }
}

export default useMathJax;
