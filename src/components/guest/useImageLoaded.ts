"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Tracks when an <img> has fully loaded, so reveal animations can wait for
 * the pixels instead of fading in an empty frame on slow networks. The
 * effect covers images that complete from cache before hydration, where
 * onLoad never fires.
 */
export default function useImageLoaded() {
  const ref = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  const onLoad = useCallback(() => setLoaded(true), []);
  useEffect(() => {
    if (ref.current?.complete) setLoaded(true);
  }, []);
  return { ref, loaded, onLoad };
}
