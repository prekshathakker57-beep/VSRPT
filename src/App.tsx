import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Page imports
import Home from "./pages/Home";
import MentorPage from "./pages/MentorPage";
import VisualLabPage from "./pages/VisualLabPage";
import Explore from "./pages/Explore";
import Results from "./pages/Results";
import StudentApp from "./pages/StudentApp";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

// ScrollToTop utility component to reset scroll coordinates or handle hash anchors
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace("#", ""));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
        return;
      }
    }
    window.scrollTo({
      top: 0,
      behavior: "instant" as any // instant scroll prevents jerky transition frames
    });
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans selection:bg-blue-500/30 selection:text-white transition-colors duration-300">
          
          {/* Reset scroll on route changes */}
          <ScrollToTop />

          {/* Global Navigation bar */}
          <Navbar />

          {/* Dynamic Route Pages Container */}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/mentor" element={<MentorPage />} />
              <Route path="/visual-lab" element={<VisualLabPage />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/results" element={<Results />} />
              <Route path="/student-app" element={<StudentApp />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              {/* Fallback redirect to Home */}
              <Route path="*" element={<Home />} />
            </Routes>
          </main>

          {/* Global Footer */}
          <Footer />

          {/* Privacy-Friendly Vercel Analytics tracking integration */}
          <Analytics />

        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

