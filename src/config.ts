export interface CourseConfig {
  id: string;
  title: string;
  shortOverview: string;
  whoFor: string;
  fullDetails: string;
  duration: string;
  frequency: string;
}

export interface TopperConfig {
  name: string;
  exam: 'NEET' | 'JEE Main' | 'JEE Advanced' | 'MHT-CET' | 'Class 11' | 'Class 12 Boards';
  year: string;
  physicsScore: string;
  overallScore: string;
  course: string;
  quote: string;
  imagePlaceholder: string;
}

export interface StudentStoryConfig {
  id: string;
  name: string;
  batch: string;
  examPrepared: string;
  achievement: string;
  description: string;
  duration: string;
  videoPath: string;
  thumbnailColor: string;
  testimonial: string;
}

export const CENTRAL_CONFIG = {
  instituteName: "V.S.R.P.T",
  domainName: "vsrpt.com",
  contactPerson: "Prof. Rohit Deshmukh (M.Tech, IIT Bombay)",
  phoneNumber: "+91 98765 43210",
  phoneNumberFormatted: "+919876543210", // for tel: links
  whatsAppNumber: "+91 98765 43210",
  whatsAppNumberFormatted: "919876543210", // for wa.me links
  emailAddress: "contact@vsrpt.com",
  fullAddress: "Plot 42, 2nd Floor, Sai Complex, Near Kothrud Depo, Karve Road, Kothrud",
  cityAndPinCode: "Pune, Maharashtra - 411038",
  workingHours: "Monday to Saturday: 11:00 AM - 8:00 PM | Sunday: 10:00 AM - 2:00 PM",
  googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.5118776850383!2d73.81156641538356!3d18.505705374461012!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bfca05a41efb%3A0xe5a36378411b418!2sKothrud%20Bus%20Depot!5e0!3m2!1sen!2sin!4v1689650000000!5m2!1sen!2sin",
  googleMapsLink: "https://maps.google.com/?q=V.S.R.P.T+Physics+Institute+Kothrud+Pune",
  
  // Classplus Student App Integration
  classplus: {
    orgCode: "VSRPT",
    androidLink: "https://play.google.com/store/apps/details?id=co.vsrpt.physics",
    iphoneLink: "https://apps.apple.com/us/app/vsrpt-physics-learning/id123456789", // Leave empty or provide mock
    webLoginLink: "https://web.classplusapp.com",
    supportPhoneNumber: "+91 98765 43211",
    supportEmail: "appsupport@vsrpt.com"
  },

  // Social Links
  socials: {
    youtube: "https://youtube.com/@vsrptphysics",
    facebook: "https://facebook.com/vsrptphysics",
    instagram: "https://instagram.com/vsrptphysics",
    twitter: "https://twitter.com/vsrptphysics"
  },

  // SEO default configurations
  seo: {
    titleTemplate: "%s | V.S.R.P.T Pune",
    defaultDescription: "Concept-based physics coaching by V.S.R.P.T for NEET, JEE Main, JEE Advanced, MHT-CET, and Class 11-12 Board exams in Kothrud, Pune. Start exploring physics today!",
    defaultKeywords: "V.S.R.P.T, vsrpt physics, physics coaching, physics class, NEET physics, JEE physics, MHT-CET physics, physics classes Pune, Kothrud",
    ogImage: "/vsrpt-logo.jpg"
  }
};

export const COURSES_DATA: CourseConfig[] = [
  {
    id: "neet-physics",
    title: "NEET Physics Elite",
    shortOverview: "Comprehensive concept building & speed-solving techniques focused on NEET-UG pattern physics.",
    whoFor: "Class 11 & 12 students aiming for outstanding ranks in medical entrance examinations.",
    fullDetails: "This course focuses on quick calculation methods, visual analysis of physical phenomena, and systematic derivation of core concepts. It covers all NCERT syllabi in exhaustive depth with extensive MCQ practice, mock papers, and historical NEET question breakdowns.",
    duration: "1 Year / 2 Year Programs",
    frequency: "3 sessions/week + Sunday mock test"
  },
  {
    id: "jee-main-physics",
    title: "JEE Main Physics",
    shortOverview: "Rigorous formula understanding and problem solving with focus on conceptual speed and accuracy.",
    whoFor: "Engineering aspirants aiming to score high percentiles in JEE Main to secure top NITs/IIITs.",
    fullDetails: "Our JEE Main Physics course bridges the gap between basic theory and complex multiple-choice mechanics. Rigorous tracking, micro-analysis of mistakes, and weekly computer-based tests prepare students for the fast-paced nature of JEE Main.",
    duration: "1 Year / 2 Year Programs",
    frequency: "3 sessions/week + Sunday test series"
  },
  {
    id: "jee-advanced-physics",
    title: "JEE Advanced Physics",
    shortOverview: "Deep structural analysis and multi-concept integration for India's toughest engineering entrance.",
    whoFor: "Top-tier aspirants aiming for top ranks in JEE Advanced to enter the prestigious IITs.",
    fullDetails: "We train students in complex problem-solving strategies, multi-variable mechanics, electrodynamics, and thermodynamic integrations. We focus on critical-thinking tasks, non-standard problems, and high-difficulty subjective questions.",
    duration: "1 Year Masterclass",
    frequency: "4 sessions/week + Advanced doubt solvers"
  },
  {
    id: "mht-cet-physics",
    title: "MHT-CET Physics booster",
    shortOverview: "Speed, accuracy, and state-board syllabus focus for Maharashtra's premier engineering entry.",
    whoFor: "Students seeking admission in top engineering colleges in Maharashtra (COEP, VJTI, etc.).",
    fullDetails: "A highly-targeted program focusing on State Board syllabus coverage, formula tricks, time-saving short-cuts, and a complete database of MHT-CET past year papers with step-by-step video solutions.",
    duration: "8-Month Intensive",
    frequency: "2 sessions/week + speed testing"
  },
  {
    id: "class-11-foundation",
    title: "Class 11 Physics Foundation",
    shortOverview: "Laying the absolute foundation of Mechanics, Kinematics, and Wave Motion. Stop fearing vectors!",
    whoFor: "Students transitioning from Class 10 to Class 11 who want to build a bulletproof core.",
    fullDetails: "Class 11 is where physics becomes math-intensive. We make vectors, calculus applications, Newton's laws of motion, and rotation intuitive and visually clear before students are overwhelmed by formulas.",
    duration: "1 Year Program",
    frequency: "3 sessions/week + monthly evaluation"
  },
  {
    id: "class-12-boards",
    title: "Class 12 Board & HSC Physics",
    shortOverview: "Perfecting derivations, step-wise board presentation, and deep conceptual electromagnetic theory.",
    whoFor: "Class 12 students wanting to secure 95%+ in Board Exams while maintaining entrance prep.",
    fullDetails: "Focuses on elegant derivation writing, structured definition layout, board-pattern mock examinations, and laboratory theory support. This ensures students do not sacrifice Board performance for entrance coaching.",
    duration: "1 Year Program",
    frequency: "3 sessions/week + structured evaluation"
  },
  {
    id: "online-live-lectures",
    title: "Online Live Interactive Lectures",
    shortOverview: "High-definition interactive live classes streaming directly to your device with digital board visuals.",
    whoFor: "Outstation students or those who prefer top-quality, self-paced, flexible learning from home.",
    fullDetails: "Experience the classroom from your study table. Features active live doubt solving, high-resolution notes sharing, and immediate access to recorded lectures for quick revision through the official Classplus app.",
    duration: "Subscription Based",
    frequency: "Flexible online batches daily"
  }
];

export const TOPPERS_DATA: TopperConfig[] = [
  {
    name: "Aditya Kulkarni",
    exam: "JEE Advanced",
    year: "2025",
    physicsScore: "112 / 120",
    overallScore: "AIR 241",
    course: "JEE Advanced Physics",
    quote: "Prof. Rohit's visualization of rotational mechanics changed my entire perspective. I went from hating physics to solving advanced mechanics questions for fun!",
    imagePlaceholder: "Aditya K."
  },
  {
    name: "Riya Shah",
    exam: "NEET",
    year: "2025",
    physicsScore: "175 / 180",
    overallScore: "695 / 720 (AIR 512)",
    course: "NEET Physics Elite",
    quote: "For biology students, physics can be scary due to math. But here, physics was taught as a story of nature first, and math was broken down into easy-to-follow steps.",
    imagePlaceholder: "Riya S."
  },
  {
    name: "Saurabh Patil",
    exam: "MHT-CET",
    year: "2025",
    physicsScore: "49 / 50",
    overallScore: "99.85 Percentile",
    course: "MHT-CET Physics booster",
    quote: "The speed shortcut formulas and weekly mocks were identical to the real exam. The time I saved in physics helped me top the chemistry section too!",
    imagePlaceholder: "Saurabh P."
  },
  {
    name: "Ananya Joshi",
    exam: "Class 12 Boards",
    year: "2025",
    physicsScore: "98 / 100",
    overallScore: "96.4% Aggregate",
    course: "Class 12 Board & HSC Physics",
    quote: "The step-by-step derivation sheet provided by the institute was a lifesaver. I could write answers in the exact format board moderators look for.",
    imagePlaceholder: "Ananya J."
  }
];

export const STUDENT_STORIES: StudentStoryConfig[] = [
  {
    id: "story-1",
    name: "Manoj Deshpande",
    batch: "2024-2025 Batch",
    examPrepared: "JEE Main & Advanced",
    achievement: "IIT Kharagpur (Aerospace Engineering)",
    description: "Manoj discusses how visual vector calculations helped him master kinematics without memorizing long checklists.",
    duration: "4 min 12s",
    videoPath: "/videos/student-story-1.mp4",
    thumbnailColor: "from-blue-600 to-indigo-900",
    testimonial: "I was extremely afraid of physics when I entered 11th. I used to just memorize formulas and fail in mock tests. At V.S.R.P.T, Rohit Sir asked me to draw diagrams for every force instead. Suddenly, everything became like a puzzle game. If you can visualize, physics is the easiest subject!"
  },
  {
    id: "story-2",
    name: "Pooja Mehta",
    batch: "2024-2025 Batch",
    examPrepared: "NEET-UG",
    achievement: "BJ Medical College, Pune (Score: 680/720)",
    description: "Pooja explains her journey from getting 60 marks in Physics mock tests to achieving 170 on the final NEET exam.",
    duration: "5 min 45s",
    videoPath: "/videos/student-story-2.mp4",
    thumbnailColor: "from-purple-600 to-indigo-900",
    testimonial: "I had a phobia of numericals in physics. I would skip numericals entirely. At V.S.R.P.T, we did focused 'numerical sprints' where we learned how to isolate variables step-by-step. The support from the doubt-solving mentors was 24/7. They never made me feel silly for asking basic math questions."
  },
  {
    id: "story-3",
    name: "Tanmay Shinde",
    batch: "2024-2025 Batch",
    examPrepared: "Class 12 & MHT-CET",
    achievement: "COEP Pune (Computer Science)",
    description: "Tanmay reviews how the Classplus Student App let him review recorded lecture archives whenever he felt stuck.",
    duration: "3 min 30s",
    videoPath: "/videos/student-story-3.mp4",
    thumbnailColor: "from-yellow-600 to-indigo-900",
    testimonial: "The Classplus app integration is seamless. If I missed a class due to illness, the recorded video was ready the next morning. The offline classes are interactive, but the digital app revision test series is what got me my speed. Highly recommended for CET students!"
  }
];

export const PARENT_TESTIMONIALS = [
  {
    parentName: "Dr. Arvind Kulkarni",
    studentName: "Aditya Kulkarni (IIT-B)",
    review: "As a doctor, I wanted my son to have strong fundamentals instead of rote-learning. Rohit Sir's custom curriculum is beautifully balanced between competitive training and foundational concepts. Aditya always returned home enthusiastic about what he learned."
  },
  {
    parentName: "Mrs. Smita Patil",
    studentName: "Saurabh Patil (99.85 Percentile)",
    review: "The focused batch size of 25 students is excellent. Unlike massive coaching factories where students are just roll numbers, the teachers here know Saurabh's strength and weaknesses personally. Their periodic performance reviews kept us well-informed."
  }
];

export interface PlaygroundGameConfig {
  id: string;
  title: string;
  description: string;
  topic: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Beginner to Advanced";
  status: "playable" | "coming_soon";
  iconName: string;
  badgeColor: string;
  gradientBg: string;
}

export const PLAYGROUND_GAMES: PlaygroundGameConfig[] = [
  {
    id: "projectile-challenge",
    title: "Projectile Challenge",
    description: "Adjust the launch angle and power to hit the target.",
    topic: "Projectile Motion",
    difficulty: "Beginner to Advanced",
    status: "playable",
    iconName: "Target",
    badgeColor: "bg-blue-100 text-blue-700 border-blue-200",
    gradientBg: "from-blue-600/10 via-indigo-600/5 to-transparent"
  },
  {
    id: "gravity-drop",
    title: "Gravity Drop",
    description: "Predict which object will reach the ground first.",
    topic: "Gravity and Free Fall",
    difficulty: "Beginner",
    status: "playable",
    iconName: "ArrowDownCircle",
    badgeColor: "bg-amber-100 text-amber-700 border-amber-200",
    gradientBg: "from-amber-500/10 via-orange-500/5 to-transparent"
  },
  {
    id: "pendulum-match",
    title: "Pendulum Match",
    description: "Adjust the pendulum length and gravity to match the target motion.",
    topic: "Oscillation and Time Period",
    difficulty: "Intermediate",
    status: "playable",
    iconName: "Activity",
    badgeColor: "bg-purple-100 text-purple-700 border-purple-200",
    gradientBg: "from-purple-500/10 via-indigo-500/5 to-transparent"
  },
  {
    id: "lens-focus",
    title: "Lens Focus",
    description: "Move the lens and object to create a clearly focused image.",
    topic: "Light and Optics",
    difficulty: "Intermediate",
    status: "playable",
    iconName: "Eye",
    badgeColor: "bg-cyan-100 text-cyan-700 border-cyan-200",
    gradientBg: "from-cyan-500/10 via-blue-500/5 to-transparent"
  },
  {
    id: "collision-lab",
    title: "Collision Lab",
    description: "Control the masses and speeds of two objects before they collide.",
    topic: "Momentum and Collisions",
    difficulty: "Advanced",
    status: "playable",
    iconName: "Zap",
    badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
    gradientBg: "from-emerald-500/10 via-teal-500/5 to-transparent"
  }
];

