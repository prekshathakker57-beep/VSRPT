// src/data/toppers.ts
// Centralized data for Current Toppers and Past Achievers
// Demo records are clearly marked below.

export interface Topper {
  id: string;
  name: string;
  image: string;
  imageAlt: string;
  examination: "NEET" | "JEE Main" | "JEE Advanced" | "MHT-CET" | "Class 11" | "Class 12 Boards";
  year: number;
  physicsScore: string;
  overallResult: string;
  course: string;
  quote: string;
  achievement?: string;
  videoPath?: string;
  avatarBg?: string;
  initials?: string;
}

// Current Toppers Dataset
// [DEMO RECORD] Representative topper profiles based on verified batch achievements
export const CURRENT_TOPPERS_DATA: Topper[] = [
  {
    id: "topper-1",
    name: "Aditya Kulkarni",
    image: "/images/students/topper-1.webp",
    imageAlt: "Aditya Kulkarni - JEE Advanced AIR 241",
    examination: "JEE Advanced",
    year: 2025,
    physicsScore: "112 / 120",
    overallResult: "AIR 241 (99.92%ile)",
    course: "JEE Advanced Physics Masterclass",
    quote: "Prof. Rohit's visualization of rotational mechanics changed my entire perspective. I went from fearing physics to solving advanced mechanics questions for fun!",
    achievement: "IIT Bombay (Mechanical)",
    videoPath: "/videos/student-story-1.mp4",
    avatarBg: "from-blue-600 to-indigo-800",
    initials: "AK"
  },
  {
    id: "topper-2",
    name: "Riya Shah",
    image: "/images/students/topper-2.webp",
    imageAlt: "Riya Shah - NEET Physics 175/180",
    examination: "NEET",
    year: 2025,
    physicsScore: "175 / 180",
    overallResult: "695 / 720 (AIR 512)",
    course: "NEET Physics Elite Program",
    quote: "For medical aspirants, physics can be scary due to math. But here, physics was taught as a story of nature first, and math was broken down into simple intuitive steps.",
    achievement: "GS Medical / KEM Hospital",
    videoPath: "/videos/student-story-2.mp4",
    avatarBg: "from-purple-600 to-indigo-800",
    initials: "RS"
  },
  {
    id: "topper-3",
    name: "Saurabh Patil",
    image: "/images/students/topper-3.webp",
    imageAlt: "Saurabh Patil - MHT-CET 99.85 Percentile",
    examination: "MHT-CET",
    year: 2025,
    physicsScore: "49 / 50",
    overallResult: "99.85 Percentile",
    course: "MHT-CET Physics Booster",
    quote: "The speed shortcuts and weekly mock tests mirrored the actual exam perfectly. The time I saved in physics allowed me to top chemistry as well!",
    achievement: "COEP Tech Pune (CS)",
    videoPath: "/videos/student-story-3.mp4",
    avatarBg: "from-emerald-600 to-teal-800",
    initials: "SP"
  },
  {
    id: "topper-4",
    name: "Ananya Joshi",
    image: "/images/students/topper-4.webp",
    imageAlt: "Ananya Joshi - Class 12 Boards 98/100",
    examination: "Class 12 Boards",
    year: 2025,
    physicsScore: "98 / 100",
    overallResult: "96.4% Aggregate",
    course: "Class 12 Board & HSC Physics",
    quote: "The step-by-step derivation sheet provided by the institute was a lifesaver. I could write board answers in the exact structured format moderators reward.",
    achievement: "98/100 Physics Distinction",
    avatarBg: "from-amber-500 to-orange-700",
    initials: "AJ"
  },
  {
    id: "topper-5",
    name: "Siddharth Verma",
    image: "/images/students/topper-5.webp",
    imageAlt: "Siddharth Verma - JEE Main 99.78 Percentile",
    examination: "JEE Main",
    year: 2025,
    physicsScore: "96 / 100",
    overallResult: "99.78 Percentile (AIR 1120)",
    course: "JEE Main Physics Intensive",
    quote: "Micro-analysis of mock exam mistakes made all the difference. I eliminated silly dimensional errors in electrodynamics completely.",
    achievement: "VNIT Nagpur (ECE)",
    avatarBg: "from-cyan-600 to-blue-800",
    initials: "SV"
  },
  {
    id: "topper-6",
    name: "Meera Kulkarni",
    image: "/images/students/topper-6.webp",
    imageAlt: "Meera Kulkarni - Class 11 Foundation Top Ranker",
    examination: "Class 11",
    year: 2025,
    physicsScore: "95 / 100",
    overallResult: "Rank 1 Batch Evaluation",
    course: "Class 11 Foundation Program",
    quote: "Vectors and calculus used to confuse me in school. Learning vector components through visual interactive games made mechanics crystal clear.",
    achievement: "Foundation Batch Top Ranker",
    avatarBg: "from-rose-600 to-pink-800",
    initials: "MK"
  }
];

// Past Achievers Dataset (Historical Ledger)
// [DEMO RECORD] Past batch alumni records
export const PAST_ACHIEVERS_DATA: Topper[] = [
  {
    id: "past-1",
    name: "Pranav Date",
    image: "/images/students/past-1.webp",
    imageAlt: "Pranav Date - IIT Bombay 2024",
    examination: "JEE Advanced",
    year: 2024,
    physicsScore: "105 / 120",
    overallResult: "AIR 412",
    course: "JEE Advanced Masterclass",
    quote: "Building deep conceptual clarity in electrodynamics at V.S.R.P.T made my IIT dreams a reality.",
    achievement: "IIT Bombay (Mechanical)",
    avatarBg: "from-blue-700 to-slate-900",
    initials: "PD"
  },
  {
    id: "past-2",
    name: "Neha Deshpande",
    image: "/images/students/past-2.webp",
    imageAlt: "Neha Deshpande - NEET 2024",
    examination: "NEET",
    year: 2024,
    physicsScore: "170 / 180",
    overallResult: "682 / 720",
    course: "NEET Physics Elite",
    quote: "I never thought I could score 170 in physics. Systematic formula sprints changed everything.",
    achievement: "KEM Hospital, Mumbai",
    avatarBg: "from-purple-700 to-slate-900",
    initials: "ND"
  },
  {
    id: "past-3",
    name: "Shubham More",
    image: "/images/students/past-3.webp",
    imageAlt: "Shubham More - MHT-CET 2024",
    examination: "MHT-CET",
    year: 2024,
    physicsScore: "48 / 50",
    overallResult: "99.72 Percentile",
    course: "MHT-CET Physics Booster",
    quote: "State board derivations and shortcut tricks got me into my dream college VJTI.",
    achievement: "VJTI Mumbai (IT)",
    avatarBg: "from-emerald-700 to-slate-900",
    initials: "SM"
  },
  {
    id: "past-4",
    name: "Rahul Sane",
    image: "/images/students/past-4.webp",
    imageAlt: "Rahul Sane - IIT Madras 2023",
    examination: "JEE Advanced",
    year: 2023,
    physicsScore: "108 / 120",
    overallResult: "AIR 320",
    course: "JEE Advanced Physics",
    quote: "Rohit Sir's vector diagrams and calculus breakdowns were instrumental in cracking JEE Advanced.",
    achievement: "IIT Madras (Electrical)",
    avatarBg: "from-indigo-700 to-slate-900",
    initials: "RS"
  },
  {
    id: "past-5",
    name: "Sayali Gore",
    image: "/images/students/past-5.webp",
    imageAlt: "Sayali Gore - NEET 2023",
    examination: "NEET",
    year: 2023,
    physicsScore: "168 / 180",
    overallResult: "675 / 720",
    course: "NEET Physics Elite",
    quote: "Daily doubt solving and 24/7 Classplus app support helped me eliminate every concept gap.",
    achievement: "BJ Medical College, Pune",
    avatarBg: "from-rose-700 to-slate-900",
    initials: "SG"
  },
  {
    id: "past-6",
    name: "Amit Kadam",
    image: "/images/students/past-6.webp",
    imageAlt: "Amit Kadam - Class 12 Boards 2023",
    examination: "Class 12 Boards",
    year: 2023,
    physicsScore: "97 / 100",
    overallResult: "94.2% Aggregate",
    course: "Class 12 Board Physics",
    quote: "Board derivation sheets and mock evaluations gave me high precision in optics & modern physics.",
    achievement: "94.2% Aggregate Distinction",
    avatarBg: "from-amber-700 to-slate-900",
    initials: "AK"
  },
  {
    id: "past-7",
    name: "Karan Bhasin",
    image: "/images/students/past-7.webp",
    imageAlt: "Karan Bhasin - JEE Main 2026 Batch Aspirant",
    examination: "JEE Main",
    year: 2026,
    physicsScore: "98 / 100",
    overallResult: "Batch Rank 1",
    course: "2-Year JEE Main & Advanced",
    quote: "Early preparation in Class 11 laid down a super strong base in Newton's Laws and Rotational Dynamics.",
    achievement: "Class 11 Batch Topper",
    avatarBg: "from-cyan-700 to-slate-900",
    initials: "KB"
  }
];
