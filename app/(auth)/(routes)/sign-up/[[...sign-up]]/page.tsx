'use client'
import { useState, useEffect } from 'react';
import bangladeshData from '@/component/bangladeshData';
import { Montserrat } from "next/font/google";
import Image from "next/image"
import Link from "next/link"

import LoginModal from '../../sign-in/[[...sign-in]]/page';

import { cn } from "@/lib/utils";

interface AuthModalProps {
  onClose: () => void;
}

const formFields = [
  { label: 'Name', type: 'text', name: 'username' },
  { label: 'Email address', type: 'email', name: 'email' },
  { label: 'Phone number', type: 'text', name: 'phone' },
  { label: 'Division', type: 'select', name: 'division' },
  { label: 'District', type: 'select', name: 'district' },
  { label: 'Upazila', type: 'select', name: 'upazila' },
  { label: 'Branch Code', type: 'number', name: 'branchCode' },
  { label: 'Password', type: 'password', name: 'password' },
];

export default function AuthModal({ onClose }: AuthModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string | number>>(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('formData');
      return savedData ? JSON.parse(savedData) : {};
    }
    return {};
  });

  const [selectedDivision, setSelectedDivision] = useState(formData['division'] || '');
  const [selectedDistrict, setSelectedDistrict] = useState(formData['district'] || '');
  const [selectedUpazila, setSelectedUpazila] = useState(formData['upazila'] || '');
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // To store the error message

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const newData = { ...prevData, [name]: name === 'branchCode' ? parseInt(value) : value };
      localStorage.setItem('formData', JSON.stringify(newData));
      return newData;
    });
  };

  const handleDivisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const division = e.target.value;
    setSelectedDivision(division);
    setSelectedDistrict('');
    setSelectedUpazila('');
    handleChange(e);
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const district = e.target.value;
    setSelectedDistrict(district);
    setSelectedUpazila('');
    handleChange(e);
  };

  const handleUpazilaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUpazila(e.target.value);
    handleChange(e);
  };

  const divisionNames = Object.keys(bangladeshData);
  const districtNames = selectedDivision
    ? Object.keys(bangladeshData[selectedDivision]?.districts || {})
    : [];
  const upazilaNames = selectedDivision && selectedDistrict
    ? bangladeshData[selectedDivision]?.districts[selectedDistrict] || []
    : [];

  const fieldsToShow = formFields.slice(currentStep * 4, (currentStep + 1) * 4);

  const handleNext = () => setCurrentStep((prevStep) => prevStep + 1);
  const handlePrev = () => setCurrentStep((prevStep) => prevStep - 1);

  const handleConfirm = async () => {
    if (!formData.email || !formData.phone || !formData.upazila || !formData.branchCode) {
      setErrorMessage('All fields are required');
      return;
    }
  
    if (typeof formData.branchCode !== 'number' || isNaN(formData.branchCode)) {
      setErrorMessage('Branch code must be a valid number');
      return;
    }
  
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        console.log("Data saved successfully");
        localStorage.removeItem('formData');
        setErrorMessage(null); // Clear any previous error messages
        onClose();
        window.location.href = '/dashboard';
      } else {
        console.log(result.errors)
        setErrorMessage(result.errors || 'Failed to save data'); // Show the specific error from the API
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage('Failed to save data'); // In case of any network or unexpected error, show a generic message
    }
  };
  

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 backdrop-blur-sm">
      <div className="relative bg-white rounded-lg shadow-lg p-6 w-[40%] max-w-lg overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>

        <h2 className="text-xl text-red-300 font-bold mb-4">Continue to PSB</h2>

        {/* Display the error message */}
        {errorMessage && Array.isArray(errorMessage) ? (
  <div className="mb-4 text-red-600 font-bold">
    {errorMessage.map((error, index) => (
      <p key={index}>{error}</p>
    ))}
  </div>
) : (
  errorMessage && (
    <div className="mb-4 text-red-600 font-bold">
      {errorMessage}
    </div>
  )
)}



        <form className="space-y-4">
          {fieldsToShow.map((field) => {
            if (field.name === 'division') {
              return (
                <div key={field.name}>
                  <label className="block mb-2 text-gray-700">{field.label}</label>
                  <select
                    name={field.name}
                    value={formData[field.name] || selectedDivision}
                    onChange={handleDivisionChange}
                    className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md"
                  >
                    <option value="">Select a Division</option>
                    {divisionNames.map((division) => (
                      <option key={division} value={division}>
                        {division}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }

            if (field.name === 'district') {
              return (
                <div key={field.name}>
                  <label className="block mb-2 text-gray-700">{field.label}</label>
                  <select
                    name={field.name}
                    value={formData[field.name] || selectedDistrict}
                    onChange={handleDistrictChange}
                    className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md"
                  >
                    <option value="">Select a District</option>
                    {districtNames.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }

            if (field.name === 'upazila') {
              return (
                <div key={field.name}>
                  <label className="block mb-2 text-gray-700">{field.label}</label>
                  <select
                    name={field.name}
                    value={formData[field.name] || selectedUpazila}
                    onChange={handleUpazilaChange}
                    className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md"
                  >
                    <option value="">Select an Upazila</option>
                    {upazilaNames.map((upazila) => (
                      <option key={upazila} value={upazila}>
                        {upazila}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }

            return (
              <div key={field.name}>
                <label className="block mb-2 text-gray-700">{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md"
                  placeholder={field.label}
                />
              </div>
            );
          })}

          <div className="flex justify-between">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className="w-[48%] py-2 text-white bg-blue-600 rounded-md"
              >
                Prev
              </button>
            )}

            {currentStep < Math.ceil(formFields.length / 4) - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="w-[48%] py-2 text-white bg-blue-600 rounded-md"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleConfirm}
                className="w-[48%] py-2 text-white bg-blue-600 rounded-md"
              >
                Confirm
              </button>
            )}
          </div>
        </form>
         {/* Login Button */}
         <div className="mt-4 text-center">
          <p className="text-gray-600">Already have an account?</p>
          <button onClick={ handleOpenModal} className="px-4 py-2 text-black bg-blue-600 rounded-md">
          Login here
      </button>
     
      {isModalOpen && <LoginModal onClose={handleCloseModal} />}
  
          {/* <button
            onClick={() => window.location.href = '/login'}
            className="text-blue-600 hover:underline"
          >
            Login here
          </button> */}
        </div>
      </div>
    </div>
  );
}  