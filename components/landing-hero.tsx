"use client";

import { useState } from 'react';
import AuthModal from '@/component/AuthModal';
import LoginModal from '@/component/LoginModal';

export const LandingHero = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleOpenAuthModal = () => {
    setIsAuthModalOpen(true);
    setIsLoginModalOpen(false); // Close LoginModal if it's open
  };

  const handleCloseAuthModal = () => setIsAuthModalOpen(false);

  const handleOpenLoginModal = () => {
    setIsLoginModalOpen(true);
    setIsAuthModalOpen(false); // Close AuthModal if it's open
  };

  const handleCloseLoginModal = () => setIsLoginModalOpen(false);

  return (
    <div className="font-bold py-36 text-center space-y-5">
      <div className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-extrabold">
        <h1>The Best AI Tool for</h1>
        {/* Typewriter effect here */}
      </div>
      <div className="text-sm md:text-xl font-light text-zinc-400">
        Create content using AI 10x faster.
      </div>
      <div>
        <button onClick={handleOpenAuthModal} className="px-4 py-2 text-black bg-blue-600 rounded-md">
          Get Started
        </button>

        {isAuthModalOpen && (
          <AuthModal
            onClose={handleCloseAuthModal}
            onOpenLogin={handleOpenLoginModal} // Pass function to open LoginModal
          />
        )}
        {isLoginModalOpen && (
          <LoginModal
            onClose={handleCloseLoginModal}
            onOpenRegister={handleOpenAuthModal} // Pass function to open AuthModal
          />
        )}
      </div>
      <div className="text-zinc-400 text-xs md:text-sm font-normal">
        No credit card required.
      </div>
    </div>
  );
};
