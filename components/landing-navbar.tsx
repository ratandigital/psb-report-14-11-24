"use client";

import { Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useState } from 'react';
import AuthModal from '@/component/AuthModal';
import LoginModal from '@/component/LoginModal'; // Import LoginModal

import { cn } from "@/lib/utils";

const font = Montserrat({ weight: '600', subsets: ['latin'] });

export const LandingNavbar = () => {
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
    <nav className="p-4 bg-transparent flex items-center justify-between">
      <Link href="/" className="flex items-center">
        <div className="relative h-8 w-8 mr-4">
          <Image fill alt="Logo" src="/logo.png" />
        </div>
        <h1 className={cn("text-2xl font-bold text-white", font.className)}>
          Genius
        </h1>
      </Link>
      <div className="flex items-center gap-x-2">
        <button
          onClick={handleOpenAuthModal}
          className="px-4 py-2 text-white bg-blue-600 rounded-md"
        >
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
    </nav>
  );
};
