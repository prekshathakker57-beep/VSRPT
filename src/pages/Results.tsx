// src/pages/Results.tsx
import { useState } from "react";
import { AlertTriangle, Award, Filter, GraduationCap, Star, BookOpen, Clock, Heart, Quote } from "lucide-react";
import SEO from "../components/SEO";
import AchievementCarousel, { CarouselItem } from "../components/results/AchievementCarousel";
import VideoModal from "../components/results/VideoModal";
import { CURRENT_TOPPERS_DATA, PAST_ACHIEVERS_DATA, Topper } from "../data/toppers";
import { TESTIMONIALS_DATA, Testimonial } from "../data/testimonials";
import { trackAnalyticsEvent } from "../utils/analytics";

export default function Results() {
  // Topper filter state
  const [topperFilter, setTopperFilter] = useState<string>("ALL");

  // Past achievers year filter state
  const [pastAchieverYear, setPastAchieverYear] = useState<string>("ALL");

  // Testimonials category filter state
  const [testimonialCategory, setTestimonialCategory] = useState<string>("ALL");

  // Video story modal state
  const [selectedVideoStory, setSelectedVideoStory] = useState<{
    isOpen: boolean;
    videoPath?: string;
    studentName: string;
    examination: string;
    achievement?: string;
    quote?: string;
    batchOrYear?: string;
  } | null>(null);

  // --- FILTER HANDLERS ---
  const handleTopperFilterChange = (filter: string) => {
    setTopperFilter(filter);
    trackAnalyticsEvent("topper_filter_selected", {
      examination: filter,
      carousel_section: "current_toppers"
    });
  };

  const handlePastAchieverYearChange = (year: string) => {
    setPastAchieverYear(year);
    trackAnalyticsEvent("past_achiever_selected", {
      year: year,
      carousel_section: "past_achievers"
    });
  };

  const handleTestimonialCategoryChange = (category: string) => {
    setTestimonialCategory(category);
    trackAnalyticsEvent("testimonial_filter_selected", {
      student_category: category,
      carousel_section: "student_experiences"
    });
  };

  // --- FILTERED DATASETS ---
  const filteredToppers: CarouselItem[] = CURRENT_TOPPERS_DATA
    .filter((t) => {
      if (topperFilter === "ALL") return true;
      return t.examination.toUpperCase() === topperFilter.toUpperCase();
    })
    .map((t) => ({
      id: t.id,
      name: t.name,
      image: t.image,
      imageAlt: t.imageAlt,
      examination: t.examination,
      year: t.year,
      physicsScore: t.physicsScore,
      overallResult: t.overallResult,
      course: t.course,
      quote: t.quote,
      achievement: t.achievement,
      videoPath: t.videoPath,
      avatarBg: t.avatarBg,
      initials: t.initials
    }));

  const filteredPastAchievers: CarouselItem[] = PAST_ACHIEVERS_DATA
    .filter((pa) => {
      if (pastAchieverYear === "ALL") return true;
      return String(pa.year) === pastAchieverYear;
    })
    .map((pa) => ({
      id: pa.id,
      name: pa.name,
      image: pa.image,
      imageAlt: pa.imageAlt,
      examination: pa.examination,
      year: pa.year,
      physicsScore: pa.physicsScore,
      overallResult: pa.overallResult,
      course: pa.course,
      quote: pa.quote,
      achievement: pa.achievement,
      videoPath: pa.videoPath,
      avatarBg: pa.avatarBg,
      initials: pa.initials
    }));

  const filteredTestimonials: CarouselItem[] = TESTIMONIALS_DATA
    .filter((t) => {
      if (testimonialCategory === "ALL") return true;
      if (testimonialCategory === "current") return t.category === "current";
      if (testimonialCategory === "former") return t.category === "former";
      if (testimonialCategory === "parent") return t.category === "parent";
      return true;
    })
    .map((t) => ({
      id: t.id,
      name: t.name,
      image: t.image,
      imageAlt: t.imageAlt,
      examination: t.examination,
      year: t.batchOrYear,
      batchOrYear: t.batchOrYear,
      category: t.category,
      quote: t.quote,
      videoPath: t.videoPath,
      videoThumbnail: t.videoThumbnail,
      videoDuration: t.videoDuration,
      achievement: t.achievement,
      parentStudentName: t.parentStudentName,
      rating: t.rating,
      avatarBg: t.avatarBg,
      initials: t.initials
    }));

  const handleOpenVideoModal = (item: CarouselItem) => {
    setSelectedVideoStory({
      isOpen: true,
      videoPath: item.videoPath,
      studentName: item.name,
      examination: item.examination || "Physics Student",
      achievement: item.achievement,
      quote: item.quote,
      batchOrYear: String(item.year || item.batchOrYear || "")
    });
  };

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen pt-20">
      <SEO 
        title="Topper Results & Student Stories" 
        description="Verify how student-centric pedagogy converts physics anxiety into elite ranks for NEET, JEE and Boards. Review verified scores and video stories."
      />

      {/* Hero Header */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-b border-blue-100 text-center bg-white">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full font-bold">
            Pedagogy Outcomes
          </span>
          <h1 className="font-sans font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight text-slate-900 leading-tight">
            Results Built Through Understanding.
          </h1>
          <p className="text-slate-600 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            We celebrate genuine conceptual mastery. Browse our toppers, past achievers, and student video interviews detailing individual academic transitions.
          </p>
        </div>
      </section>

      {/* STUDENT EXPERIENCES (VIDEO TESTIMONIALS) SECTION */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-blue-100">
        
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full font-bold">
            Student Experiences
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Hear directly from students who learned to understand physics with confidence.
          </h2>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed">
            Watch current and former students share how concept-based teaching, interactive simulations, and 24/7 doubt solving transformed their exam preparation.
          </p>

          {/* Testimonial Category Filters */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {[
              { id: "ALL", label: "All Stories" },
              { id: "current", label: "Current Students" },
              { id: "former", label: "Former Students" },
              { id: "parent", label: "Parent Reviews" }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleTestimonialCategoryChange(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  testimonialCategory === cat.id
                    ? "bg-blue-600 border-blue-500 text-white shadow-md"
                    : "bg-white border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Curved Thumbnail Carousel for Student Experiences */}
        <AchievementCarousel
          items={filteredTestimonials}
          variant="testimonial"
          sectionTitle="Student Experiences"
          emptyMessage="No video testimonials found for the selected category."
          onWatchVideo={handleOpenVideoModal}
          carouselId="student_experiences"
        />

      </section>

      {/* 1. CURRENT TOPPERS SECTION WITH CAROUSEL */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 text-left">
          <div className="space-y-2">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest font-bold">Hall of Fame</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Current Toppers</h2>
          </div>

          {/* Topper Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: "ALL", label: "All Toppers" },
              { id: "NEET", label: "NEET" },
              { id: "JEE MAIN", label: "JEE Main" },
              { id: "JEE ADVANCED", label: "JEE Advanced" },
              { id: "MHT-CET", label: "MHT-CET" },
              { id: "CLASS 11", label: "Class 11" },
              { id: "CLASS 12 BOARDS", label: "Class 12 Boards" }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => handleTopperFilterChange(f.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase transition-all border cursor-pointer ${
                  topperFilter === f.id
                    ? "bg-blue-600 border-blue-500 text-white shadow-md"
                    : "bg-white border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Curved Thumbnail Carousel for Current Toppers */}
        <AchievementCarousel
          items={filteredToppers}
          variant="topper"
          sectionTitle="Current Toppers"
          emptyMessage="No student result has been added to this category yet."
          onWatchVideo={handleOpenVideoModal}
          carouselId="current_toppers"
        />

      </section>

      {/* 2. PAST ACHIEVERS SECTION WITH CAROUSEL */}
      <section className="py-16 bg-blue-50/30 border-y border-blue-100 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 text-left">
            <div className="space-y-2">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest font-bold">Historical Ledger</span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Past Achievers</h2>
            </div>

            {/* Year Selector Toggles */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: "ALL", label: "All Years" },
                { id: "2026", label: "2026 Batch" },
                { id: "2025", label: "2025 Batch" },
                { id: "2024", label: "2024 Batch" },
                { id: "2023", label: "2023 Batch" }
              ].map((yr) => (
                <button
                  key={yr.id}
                  onClick={() => handlePastAchieverYearChange(yr.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    pastAchieverYear === yr.id
                      ? "bg-blue-600 border-blue-500 text-white shadow-md"
                      : "bg-white border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  {yr.label}
                </button>
              ))}
            </div>
          </div>

          {/* Curved Thumbnail Carousel for Past Achievers */}
          <AchievementCarousel
            items={filteredPastAchievers}
            variant="topper"
            sectionTitle="Past Achievers"
            emptyMessage="No historical achiever record found for the selected year."
            onWatchVideo={handleOpenVideoModal}
            carouselId="past_achievers"
          />

          {/* Compact Archive Grid below Carousel */}
          <div className="mt-12 pt-8 border-t border-blue-100/80">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-4 text-left">
              Historical Ledger Snapshot ({pastAchieverYear === "ALL" ? "All Batches" : `${pastAchieverYear} Batch`})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredPastAchievers.map((achiever) => (
                <div
                  key={achiever.id}
                  className="p-4 rounded-2xl border border-blue-100 bg-white text-left flex items-center space-x-3.5 hover:border-blue-300 transition-all shadow-sm"
                >
                  <div className={`h-11 w-11 rounded-full bg-gradient-to-br ${achiever.avatarBg || "from-blue-600 to-indigo-800"} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm`}>
                    {achiever.initials || achiever.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-sans font-bold text-sm text-slate-900 truncate">{achiever.name}</h4>
                    <span className="block text-[11px] text-slate-500 truncate mt-0.5">
                      {achiever.examination} ({achiever.year}) — {achiever.achievement}
                    </span>
                    <span className="block text-[10px] text-emerald-600 font-mono font-semibold mt-0.5">
                      Physics: {achiever.physicsScore}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="py-12 bg-white px-4 sm:px-6 lg:px-8 border-t border-blue-100 text-center">
        <div className="max-w-3xl mx-auto flex items-start space-x-3 text-slate-500 text-left bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs font-sans leading-relaxed text-slate-600">
            <strong>Results &amp; Stories Disclaimer:</strong> Results and student stories are published only after receiving permission from the student or guardian. Individual results vary and are not guaranteed.
          </div>
        </div>
      </section>

      {/* Accessible Video Story Modal */}
      {selectedVideoStory && (
        <VideoModal
          isOpen={selectedVideoStory.isOpen}
          onClose={() => setSelectedVideoStory(null)}
          videoPath={selectedVideoStory.videoPath}
          studentName={selectedVideoStory.studentName}
          examination={selectedVideoStory.examination}
          achievement={selectedVideoStory.achievement}
          quote={selectedVideoStory.quote}
          batchOrYear={selectedVideoStory.batchOrYear}
        />
      )}

    </div>
  );
}
