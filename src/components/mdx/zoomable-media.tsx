"use client";

import { motion, AnimatePresence, MotionConfig } from "motion/react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

type ZoomableMediaProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
};

export function ZoomableMedia({
  src,
  alt,
  width,
  height,
  className,
}: ZoomableMediaProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  const handleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isZoomed) {
        setIsZoomed(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isZoomed]);

  return (
    <MotionConfig
      transition={{ duration: 0.3, type: "spring", bounce: 0 }}
    >
      <motion.div id="media-container" className={cn("relative w-full h-auto border", className)}>
        <motion.img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-full object-contain cursor-zoom-in"
          layoutId={`media-container-${src}`}
          onClick={handleZoom}
        />
      </motion.div>
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            layout
            layoutRoot
            className="fixed inset-0 w-screen h-screen bg-black/50 flex items-center justify-center z-50 p-4 md:p-8 lg:p-12 cursor-zoom-out"
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(10px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            onClick={handleZoom}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.img
                src={src}
                alt={alt}
                width={width}
                height={height}
                className="max-w-full max-h-full object-contain"
                layoutId={`media-container-${src}`}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
