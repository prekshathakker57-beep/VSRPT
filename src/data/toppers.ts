// src/data/toppers.ts
// Centralized data for Current Toppers and Past Achievers at V.S.R.P.T Physics Institute

export interface Topper {
  id?: string;
  name: string;
  exam: string;
  year: number;
  category: "Current Toppers" | "Past Achievers";
  videoUrl: string;
  externalUrl?: string;
  // Additional verified information only (no placeholders, no N/A, no dummy text)
  achievement?: string;
  quote?: string;
  physicsScore?: string;
}

/**
 * Normalizes any YouTube URL (Shorts, Watch, youtu.be, or Embed) into an official embed URL
 */
export function normalizeYoutubeEmbedUrl(url: string): string {
  if (!url) return "";
  if (url.includes("/embed/")) return url;
  const shortMatch = url.match(/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  const youtuMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (youtuMatch) return `https://www.youtube.com/embed/${youtuMatch[1]}`;
  return url;
}

/**
 * Reusable, extensible data collection for student toppers & testimonials.
 * Adding another topper will automatically place the new card correctly in the grid.
 */
export const TOPPERS_DATA: Topper[] = [
  // CURRENT TOPPERS — 2026
  {
    name: "Tanisha Iyar",
    exam: "NEET",
    year: 2026,
    category: "Current Toppers",
    videoUrl: "https://www.youtube.com/embed/pgJMCSI-fmg",
    externalUrl: "https://youtube.com/shorts/pgJMCSI-fmg"
  },

  // PAST ACHIEVERS — 2025
  {
    name: "Chinmay",
    exam: "NEET",
    year: 2025,
    category: "Past Achievers",
    videoUrl: "https://www.youtube.com/embed/Yy8P6Qg7WdA",
    externalUrl: "https://youtube.com/shorts/Yy8P6Qg7WdA"
  },
  {
    name: "Satej",
    exam: "JEE",
    year: 2025,
    category: "Past Achievers",
    videoUrl: "https://www.youtube.com/embed/fl8qrZTdLJc",
    externalUrl: "https://youtube.com/shorts/fl8qrZTdLJc"
  },
  {
    name: "Harshit",
    exam: "NEET",
    year: 2025,
    category: "Past Achievers",
    videoUrl: "https://www.youtube.com/embed/NwN8mVojX6o",
    externalUrl: "https://youtube.com/shorts/NwN8mVojX6o"
  }
];

// Helper subsets for direct consumption
export const CURRENT_TOPPERS_DATA: Topper[] = TOPPERS_DATA.filter(
  (t) => t.category === "Current Toppers" || t.year === 2026
);

export const PAST_ACHIEVERS_DATA: Topper[] = TOPPERS_DATA.filter(
  (t) => t.category === "Past Achievers" || t.year !== 2026
);
