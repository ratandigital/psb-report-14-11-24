

"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import bangladeshData from '@/component/bangladeshData';
import jwt from 'jsonwebtoken';
import { LandingNavbar } from "@/components/landing-navbar";
import { LandingHero } from "@/components/landing-hero";
import { LandingContent } from "@/components/landing-content";

const LandingPage = () => {
  useEffect(() => {
   
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('session='))
      ?.split('=')[1];
      console.log(token)
    if (token) {
      const decodedToken = jwt.decode(token) as { status?: string };
      console.log(decodedToken)
      const isAdmin = decodedToken?.status === 'approved';
      

    
    } else {
    
    }
  }, []);
  return ( 
    <div className="h-full ">
      <LandingNavbar />
      <LandingHero />
      <LandingContent />
    </div>
   );
}
 
export default LandingPage;
