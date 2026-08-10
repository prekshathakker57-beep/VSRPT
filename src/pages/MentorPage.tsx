import React, { useEffect } from "react";
import SEO from "../components/SEO";
import MeetOurMentor from "../components/MeetOurMentor";

export default function MentorPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO
        title="Meet Our Mentor — Prof. Vishal Shibad | V.S.R.P.T Physics Institute"
        description="Meet Prof. Vishal Shibad (M.Tech, IIT Bombay), founder and lead mentor at V.S.R.P.T Physics Institute in Pune with 15+ years of experience guiding 5,000+ students for NEET & JEE."
        canonicalPath="/mentor"
      />
      <div className="pt-20">
        <MeetOurMentor />
      </div>
    </>
  );
}
