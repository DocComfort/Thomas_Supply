"use client";
import { useState } from "react";

// Shows the logo image from /public/photos. If the file isn't there yet
// (e.g. before running the download script), it falls back to a text chip
// so the layout never breaks.
export default function BrandLogo({ name, file, height = 48 }) {
  const [failed, setFailed] = useState(false);

  if (failed || !file) {
    return <span className="chip">{name}</span>;
  }
  return (
    <span className="logo-tile" title={name}>
      <img
        src={`/photos/${file}`}
        alt={`${name} logo`}
        height={height}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    </span>
  );
}
