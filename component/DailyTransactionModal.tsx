"use client";

import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface DailyTransactionModalProps {
  onClose: () => void;
}

interface TransactionData {
  newSavingsAccounts?: number;
  newDPSAccounts?: number;
  newLoanAccounts?: number;
  oldSavingsAccounts?: number;
  oldDPSAccounts?: number;
  oldLoanAccounts?: number;
  savingsCollection?: number;
  loanCollectionRegular?: number;
  loanCollectionSMA?: number;
  loanCollectionCL?: number;
  loanDisbursement?: number;
  savingsWithdrawn?: number;
  operatingExpenses?: number;
  totalDebitPosting?: number;
  totalCreditPosting?: number;
  cumulativeProfile?: number;
  [key: string]: number | undefined;
}

const transactionSteps = [
  [
    { label: 'New Savings Accounts Open', type: 'number', name: 'newSavingsAccounts' },
    { label: 'New DPS/Scheme Accounts Open', type: 'number', name: 'newDPSAccounts' },
    { label: 'New Loan Accounts Open', type: 'number', name: 'newLoanAccounts' },
  ],
  [
    { label: 'Old Savings Accounts Close', type: 'number', name: 'oldSavingsAccounts' },
    { label: 'Old DPS/Scheme Accounts Close', type: 'number', name: 'oldDPSAccounts' },
    { label: 'Old Loan Accounts Close', type: 'number', name: 'oldLoanAccounts' },
  ],
  [
    { label: 'Savings/DPS Collection', type: 'number', name: 'savingsCollection' },
    { label: 'Loan Collection Regular/STD', type: 'number', name: 'loanCollectionRegular' },
    { label: 'Loan Collection SMA', type: 'number', name: 'loanCollectionSMA' },
    { label: 'Loan Collection CL', type: 'number', name: 'loanCollectionCL' },
  ],
  [
    { label: 'Loan Disbursement', type: 'number', name: 'loanDisbursement' },
    { label: 'Savings/DPS Withdrawn', type: 'number', name: 'savingsWithdrawn' },
    { label: 'Operating Expenses', type: 'number', name: 'operatingExpenses' },
  ],
  [
    { label: 'Total Debit Posting', type: 'number', name: 'totalDebitPosting' },
    { label: 'Total Credit Posting', type: 'number', name: 'totalCreditPosting' },
  ],
  [
    { label: 'Cumulative Profile', type: 'number', name: 'cumulativeProfile' },
  ],
];

export default function DailyTransactionModal({ onClose }: DailyTransactionModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<TransactionData>(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('transactionData');
      return savedData ? JSON.parse(savedData) : {};
    }
    return {};
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('transactionData', JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData: TransactionData) => ({
      ...prevData,
      [name]: parseInt(value) || 0,
    }));
  };

  const validateStep = () => {
    const requiredFields = transactionSteps[currentStep].map((field) => field.name);
    for (let field of requiredFields) {
      if (!formData[field] && formData[field] !== 0) {
        setErrorMessage(`Please fill in all fields.`);
        return false;
      }
    }
    setErrorMessage(null);
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => setCurrentStep(currentStep - 1);

  const handleConfirm = async () => {
    if (validateStep()) {
      try {
        const response = await fetch('/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (response.ok) {
          // Show success toast
          toast.success('Transaction saved successfully!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          
          localStorage.removeItem('transactionData');
          onClose();
        } else {
          setErrorMessage(result.error || 'Failed to save transaction');
        }
      } catch (error) {
        console.error("Error:", error);
        setErrorMessage('Failed to save transaction');
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 backdrop-blur-sm z-50">
      <ToastContainer />
      <div className="relative bg-white rounded-lg shadow-lg p-6 w-[40%] max-w-lg overflow-hidden">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          &times;
        </button>

        <h2 className="text-xl font-bold text-blue-600 mb-4">Daily Transaction</h2>

        {errorMessage && (
          <div className="mb-4 text-red-600 font-bold">{errorMessage}</div>
        )}

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          {transactionSteps[currentStep].map((field) => (
            <div key={field.name}>
              <label className="block mb-2 text-gray-700">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 mb-4 text-gray-700 border border-gray-300 rounded-md"
                placeholder={field.label}
              />
            </div>
          ))}

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

            {currentStep < transactionSteps.length - 1 ? (
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
      </div>
    </div>
  );
}
