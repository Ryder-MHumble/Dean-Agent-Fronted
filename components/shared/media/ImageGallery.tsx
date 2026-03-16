"use client";

import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: string[];
  maxVisible?: number;
  className?: string;
}

export function ImageGallery({
  images,
  maxVisible = 3,
  className,
}: ImageGalleryProps) {
  if (!images || images.length === 0) return null;

  const visible = images.slice(0, maxVisible);
  const remaining = images.length - maxVisible;

  return (
    <div
      className={cn(
        "grid gap-1",
        visible.length === 1
          ? "grid-cols-1"
          : visible.length === 2
            ? "grid-cols-2"
            : "grid-cols-3",
        className,
      )}
    >
      {visible.map((url, i) => (
        <div key={i} className="relative aspect-square overflow-hidden rounded">
          <img
            src={url}
            alt={`图片 ${i + 1}`}
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
          {i === maxVisible - 1 && remaining > 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold text-lg">+{remaining}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
