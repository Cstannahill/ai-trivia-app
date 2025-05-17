"use client";

import { ReactNode } from "react";
import clsx from "clsx";

interface TexturedOverlayProps {
  children: ReactNode;
  position?: "above" | "below";
  className?: string;
  opacity?: number;
  textureUrl?: string;
}

/**
 * TexturedOverlay
 * ---------------------
 * Adds a grainy noise texture to your content.
 * Can be used as a background or foreground detail layer.
 *
 * ✅ Use for:
 * - Layout sections
 * - Subtle visual depth on full-width elements
 * - Foreground shimmer or flicker effects
 *
 * 🧠 Design Notes:
 * - Use `position="above"` for grain on top of UI
 * - Use `position="below"` for background texture
 * - Default texture is `/textures/noise.png`
 *
 * 🛠️ Props:
 * - position: 'above' | 'below' (default: 'below')
 * - textureUrl: string (default: '/textures/noise.png')
 * - opacity: number (0.0–1.0)
 *
 * 🚀 Example Usage:
 * <TexturedOverlay opacity={0.05}>
 *   <PaperBlock>...</PaperBlock>
 * </TexturedOverlay>
 */
export default function TexturedOverlay({
  children,
  position = "below",
  className,
  textureUrl = "@/assets/textures/noise.png",
  opacity = 0.05,
}: TexturedOverlayProps) {
  return (
    <div className={clsx("relative", className)}>
      {position === "above" && (
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            backgroundImage: `url(${textureUrl})`,
            backgroundSize: "cover",
            opacity,
          }}
        />
      )}

      {children}

      {position === "below" && (
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: `url(${textureUrl})`,
            backgroundSize: "cover",
            opacity,
          }}
        />
      )}
    </div>
  );
}
