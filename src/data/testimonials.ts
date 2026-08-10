// src/data/testimonials.ts
// Centralized data for Student Video Testimonials and Parent Reviews
// Demo records are clearly marked below.

export interface Testimonial {
  id: string;
  name: string;
  image: string;
  imageAlt: string;
  category: "current" | "former" | "parent";
  batchOrYear: string;
  examination: string;
  quote: string;
  videoPath?: string;
  videoThumbnail?: string;
  videoDuration?: string;
  achievement?: string;
  parentStudentName?: string;
  rating?: number;
  avatarBg?: string;
  initials?: string;
}

// Student Video Experiences & Stories Dataset
// [DEMO RECORD] Representative student stories and verified parent feedback
export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: "story-1",
    name: "Manoj Deshpande",
    image: "/images/students/testimonial-1.webp",
    imageAlt: "Manoj Deshpande - Student Video Story",
    category: "former",
    batchOrYear: "2024-2025 Batch",
    examination: "JEE Main & Advanced",
    achievement: "IIT Kharagpur (Aerospace)",
    quote: "I was terrified of physics in 11th grade and kept memorizing formulas blindly. At V.S.R.P.T, Prof. Rohit taught me to draw vector force diagrams first. Suddenly physics felt like solving fun logical puzzles!",
    videoPath: "/videos/student-story-1.mp4",
    videoThumbnail: "/images/students/testimonial-1-thumb.jpg",
    videoDuration: "4:12",
    avatarBg: "from-blue-600 to-indigo-900",
    initials: "MD"
  },
  {
    id: "story-2",
    name: "Pooja Mehta",
    image: "/images/students/testimonial-2.webp",
    imageAlt: "Pooja Mehta - Student Video Story",
    category: "former",
    batchOrYear: "2024-2025 Batch",
    examination: "NEET-UG",
    achievement: "BJ Medical College (Score: 680/720)",
    quote: "I used to score barely 60 marks in physics mock tests. After joining the numerical sprints and getting 24/7 doubt resolution, my confidence soared to 170 on the final NEET exam day!",
    videoPath: "/videos/student-story-2.mp4",
    videoThumbnail: "/images/students/testimonial-2-thumb.jpg",
    videoDuration: "5:45",
    avatarBg: "from-purple-600 to-indigo-900",
    initials: "PM"
  },
  {
    id: "story-3",
    name: "Tanmay Shinde",
    image: "/images/students/testimonial-3.webp",
    imageAlt: "Tanmay Shinde - Student Video Story",
    category: "current",
    batchOrYear: "2025-2026 Batch",
    examination: "Class 12 & MHT-CET",
    achievement: "COEP Pune Aspirant",
    quote: "The Classplus student app integration is seamless. If I ever need to review a complex electrodynamics derivation late at night, the recorded HD lecture is right there on my phone.",
    videoPath: "/videos/student-story-3.mp4",
    videoThumbnail: "/images/students/testimonial-3-thumb.jpg",
    videoDuration: "3:30",
    avatarBg: "from-amber-600 to-orange-900",
    initials: "TS"
  },
  {
    id: "story-4",
    name: "Shruti Salunkhe",
    image: "/images/students/testimonial-4.webp",
    imageAlt: "Shruti Salunkhe - Student Video Story",
    category: "current",
    batchOrYear: "2025-2026 Batch",
    examination: "NEET-UG",
    achievement: "Top 5% Rank in Weekly Sprints",
    quote: "The step-by-step visual problem breakdowns made optics and thermodynamics so intuitive. Every Sunday mock test helped me track my exact accuracy improvement.",
    videoPath: "/videos/student-story-4.mp4",
    videoThumbnail: "/images/students/testimonial-4-thumb.jpg",
    videoDuration: "4:05",
    avatarBg: "from-teal-600 to-emerald-900",
    initials: "SS"
  },
  {
    id: "story-5",
    name: "Dr. Arvind Kulkarni",
    image: "/images/students/parent-1.webp",
    imageAlt: "Dr. Arvind Kulkarni - Parent Review",
    category: "parent",
    batchOrYear: "Parent Guardian",
    examination: "Parent of Aditya Kulkarni (IIT-B)",
    parentStudentName: "Aditya Kulkarni",
    achievement: "Guardian Review",
    quote: "As a practicing physician, I valued true conceptual understanding over rote learning. Prof. Rohit's curriculum is beautifully structured. Aditya returned home after every class truly excited about physics.",
    rating: 5,
    avatarBg: "from-sky-700 to-slate-900",
    initials: "AK"
  },
  {
    id: "story-6",
    name: "Mrs. Smita Patil",
    image: "/images/students/parent-2.webp",
    imageAlt: "Mrs. Smita Patil - Parent Review",
    category: "parent",
    batchOrYear: "Parent Guardian",
    examination: "Parent of Saurabh Patil (99.85 %ile)",
    parentStudentName: "Saurabh Patil",
    achievement: "Guardian Review",
    quote: "The small batch size of 25 students is a huge advantage. Teachers personally know every student's strengths and weaknesses instead of treating them as roll numbers.",
    rating: 5,
    avatarBg: "from-amber-700 to-slate-900",
    initials: "SP"
  }
];
