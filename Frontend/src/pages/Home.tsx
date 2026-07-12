import React from 'react';
import { LandingNav } from '../components/Landing/LandingNav';
import { LandingHero } from '../components/Landing/LandingHero';
import { TrustedBy } from '../components/Landing/TrustedBy';
import { InteractiveDemo } from '../components/Landing/InteractiveDemo';
import { LandingHowItWorks } from '../components/Landing/LandingHowItWorks';
import { Worlds } from '../components/Landing/Worlds';
import { AIFeatures } from '../components/Landing/AIFeatures';
import { Gamification } from '../components/Landing/Gamification';
import { LandingParentDashboard } from '../components/Landing/LandingParentDashboard';
import { LandingTeacherDashboard } from '../components/Landing/LandingTeacherDashboard';
import { LandingTestimonials } from '../components/Landing/LandingTestimonials';
import { Pricing } from '../components/Landing/Pricing';
import { FAQ } from '../components/Landing/FAQ';
import { LandingFooter } from '../components/Landing/LandingFooter';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNav />
      <main>
        <LandingHero />
        <TrustedBy />
        <InteractiveDemo />
        <LandingHowItWorks />
        <Worlds />
        <AIFeatures />
        <Gamification />
        <LandingParentDashboard />
        <LandingTeacherDashboard />
        <LandingTestimonials />
        <Pricing />
        <FAQ />
      </main>
      <LandingFooter />
    </div>
  );
};

export default Home;