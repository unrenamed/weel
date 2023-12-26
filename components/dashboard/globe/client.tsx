"use client";

import { MouseEvent, TouchEvent, useEffect, useRef, useState } from "react";
import createGlobe from "cobe";
import { useIntersectionObserver } from "@/hooks";
import { motion, useSpring } from "framer-motion";

type Props = {
  markers: {
    location: [number, number];
    size: number;
  }[];
};

export default function GlobeClient({ markers }: Props) {
  const [isWebGLSupported, setIsWebGLSupported] = useState(false);
  const [containerRef, entry] = useIntersectionObserver<HTMLDivElement>({});
  const isGlobeInViewport = !!entry?.isIntersecting;

  useEffect(() => {
    if (detectIfWebGLSupported()) {
      setIsWebGLSupported(true);
    } else {
      console.warn(
        "Your browser or device may not support WebGL. Hiding the globe animation..."
      );
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full m-auto aspect-square max-w-[600px]"
    >
      {isWebGLSupported && isGlobeInViewport && (
        <GlobeCanvas markers={markers} />
      )}
    </div>
  );
}

function GlobeCanvas({ markers }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);

  const r = useSpring(0, {
    mass: 1,
    damping: 50,
    stiffness: 300,
  });

  useEffect(() => {
    if (!canvasRef.current) return;

    let phi = 0;
    let width = 0;

    const onResize = () =>
      canvasRef.current && (width = canvasRef.current.offsetWidth);

    window.addEventListener("resize", onResize);
    onResize();

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.3,
      dark: 0.9,
      opacity: 0.7,
      diffuse: 2.0,
      mapSamples: 20000,
      mapBrightness: 8,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [1, 0.812, 0],
      glowColor: [1, 1, 1],
      markers,
      onRender: (state) => {
        if (!pointerInteracting.current) {
          phi += 0.005;
        }
        // Called on every animation frame.
        // `state` will be an empty object, return updated params.
        state.phi = phi + r.get();
        state.width = width * 2;
        state.height = width * 2;
      },
    });

    setTimeout(() => {
      canvasRef.current && (canvasRef.current.style.opacity = "1");
    });

    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [r, markers]);

  const handlePointerDown = (e: MouseEvent<HTMLCanvasElement>) => {
    pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
    canvasRef.current && (canvasRef.current.style.cursor = "grabbing");
  };

  const handlePointerUp = () => {
    pointerInteracting.current = null;
    canvasRef.current && (canvasRef.current.style.cursor = "grab");
  };

  const handlePointerOut = () => {
    pointerInteracting.current = null;
    canvasRef.current && (canvasRef.current.style.cursor = "grab");
  };

  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    if (pointerInteracting.current !== null) {
      const delta = e.clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta;
      r.set(delta / 200);
    }
  };

  const handleTouchMove = (e: TouchEvent<HTMLCanvasElement>) => {
    if (pointerInteracting.current !== null && e.touches[0]) {
      const delta = e.touches[0].clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta;
      r.set(delta / 100);
    }
  };

  return (
    <motion.canvas
      ref={canvasRef}
      className="w-full h-full opacity-0 transition-opacity duration-1000 ease-in"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerOut={handlePointerOut}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    />
  );
}

function detectIfWebGLSupported() {
  const canvas = document.createElement("canvas");
  const gl =
    canvas.getContext("webgl") ?? canvas.getContext("experimental-webgl");
  return gl instanceof WebGLRenderingContext;
}
