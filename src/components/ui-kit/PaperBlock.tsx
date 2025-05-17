"use client";

import clsx from "clsx";
import { ReactNode } from "react";

interface PaperBlockProps {
  children: ReactNode;
  className?: string;
  background?: "default" | "glass" | "texture";
  padding?: string;
}

export default function PaperBlock({
  children,
  className,
  background = "default",
  padding = "p-8",
}: PaperBlockProps) {
  const baseStyles = clsx(
    "relative rounded-3xl shadow-xl overflow-hidden",
    padding,
    className
  );

  const backgroundLayer =
    background === "glass"
      ? "bg-sky-900/50"
      : background === "texture"
      ? 'bg-[#001f2e] bg-[url("/textures/fibric.png")] bg-cover bg-center'
      : "bg-gradient-to-br from-[#001f2e] to-[#002f40]";

  return <div className={clsx(baseStyles, backgroundLayer)}>{children}</div>;
}

/*

Usage Example:

<PaperBlock background="texture">
  <h2 className="text-xl text-white font-bold mb-2">Vibrant Card</h2>
  <p className="text-sm text-white/80">
    MongoDB-inspired depth with reusable styling.
  </p>
</PaperBlock>

*/
