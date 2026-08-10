import React, { useEffect } from "react";
import SEO from "../components/SEO";
import PhysicsVisualLab from "../components/PhysicsVisualLab";

export default function VisualLabPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO
        title="Physics Visual Lab — Conceptual Visual Explainers | V.S.R.P.T Physics Institute"
        description="Explore visual explanations, thought experiments, and fascinating Physics concepts designed to make complex ideas easier to understand."
        canonicalPath="/visual-lab"
      />
      <div className="pt-16">
        <PhysicsVisualLab />
      </div>
    </>
  );
}
