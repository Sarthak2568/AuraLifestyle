// src/components/IKImg.tsx
import React from "react";
import { ik, ikSrcSet } from "@/lib/ik";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  width: number;  // required to prevent layout shift
  height: number; // required to prevent layout shift
  sizes?: string;
  quality?: number;
  widths?: number[]; // for srcset
};

export default function IKImg({
  src,
  width,
  height,
  sizes = "100vw",
  quality = 85,
  widths = [320, 480, 640, 768, 960, 1200, 1600],
  loading = "lazy",
  decoding = "async",
  ...rest
}: Props) {
  const srcUrl = ik(src, { w: width, q: quality });
  const srcset = ikSrcSet(src, widths, quality);

  return (
    <img
      src={srcUrl}
      srcSet={srcset}
      sizes={sizes}
      width={width}
      height={height}
      loading={loading as any}
      decoding={decoding as any}
      {...rest}
    />
  );
}
