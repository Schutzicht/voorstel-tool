import { useRef, useEffect, type ReactNode, type HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

/**
 * Renders children at 1280x720 and scales them to fit the container width,
 * maintaining 16:9 aspect ratio. Properly cleans up its ResizeObserver.
 */
export function ScaledSlide({ children, className = '', ...rest }: Props) {
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = innerRef.current;
    const container = el?.parentElement;
    if (!el || !container) return;

    const updateScale = () => {
      const scale = container.offsetWidth / 1280;
      el.style.transform = `scale(${scale})`;
    };
    updateScale();

    const ro = new ResizeObserver(updateScale);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  return (
    <div className={`w-full relative ${className}`} style={{ paddingBottom: '56.25%' }} {...rest}>
      <div className="absolute inset-0 overflow-hidden bg-[#FAF9F6]">
        <div
          ref={innerRef}
          className="absolute origin-top-left"
          style={{ width: '1280px', height: '720px' }}
        >
          <div className="pdf-slide w-full h-full relative" style={{ width: '1280px', height: '720px' }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
