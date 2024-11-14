'use client'

import { useState } from 'react';
import AuthModal from '@/component/AuthModal';


export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="p-6">
      <button onClick={handleOpenModal} className="px-4 py-2 text-white bg-blue-600 rounded-md">
        Open Auth Modal
      </button>

      {isModalOpen && <AuthModal onClose={handleCloseModal} />}
    </div>
  );
}
