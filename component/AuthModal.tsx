import { useState } from 'react';
import bangladeshData from './bangladeshData';

interface AuthModalProps {
  onClose: () => void;
  onOpenLogin: () => void;
}

const formFields = [
  { label: 'Name', type: 'text', name: 'username' },
  { label: 'Email address', type: 'email', name: 'email' },
  { label: 'Phone number', type: 'text', name: 'phone' },
  { label: 'Branch Code', type: 'number', name: 'branchCode' },
  { label: 'Division', type: 'select', name: 'division' },
  { label: 'District', type: 'select', name: 'district' },
  { label: 'Upazila', type: 'select', name: 'upazila' },

  { label: 'Password', type: 'password', name: 'password' },
];

export default function AuthModal({ onClose, onOpenLogin }: AuthModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string | number>>(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('formData');
      return savedData ? JSON.parse(savedData) : {};
    }
    return {};
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const newData = { ...prevData, [name]: name === 'branchCode' ? parseInt(value) : value };
      localStorage.setItem('formData', JSON.stringify(newData));
      return newData;
    });
  };

  const fieldsToShow = formFields.slice(currentStep * 4, (currentStep + 1) * 4);

  // Validation function to check if all required fields are filled
  const validateStep = () => {
    const requiredFields = fieldsToShow.map(field => field.name);
    for (let field of requiredFields) {
      if (!formData[field]) {
        setErrorMessage(`Please fill in all required fields before proceeding.`);
        return false;
      }
    }
    setErrorMessage(null); // Clear error if all fields are filled
    return true;
  };

  // Move to next step if validation passes
  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  // Move to previous step
  const handlePrev = () => setCurrentStep((prevStep) => prevStep - 1);

  const handleConfirm = async () => {
    // Final validation before submission
    if (validateStep()) {
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
          console.log(result.errors);
          setErrorMessage(result.errors || 'Failed to save data'); // Show the specific error from the API
        }
      } catch (error) {
        console.error("Error:", error);
        setErrorMessage('Failed to save data'); // In case of any network or unexpected error, show a generic message
      }
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
        {errorMessage && (
          <div className="mb-4 text-red-600 font-bold">
            {errorMessage}
          </div>
        )}

        <form className="space-y-4">
          {fieldsToShow.map((field) => {
            if (field.type === 'select') {
              // Handle Division, District, Upazila fields with select options
              const options = field.name === 'division'
                ? Object.keys(bangladeshData)
                : field.name === 'district'
                ? formData['division']
                  ? Object.keys(bangladeshData[formData['division']]?.districts || {})
                  : []
                : formData['district']
                ? bangladeshData[formData['division']].districts[formData['district']] || []
                : [];

              return (
                <div key={field.name}>
                  <label className="block mb-2 text-gray-700">{field.label}</label>
                  <select
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md"
                  >
                    <option value="">Select {field.label}</option>
                    {options.map((option) => (
                      <option key={option} value={option}>
                        {option}
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

        <div className="mt-4 text-center">
          <p className="text-gray-600">Already have an account?</p>
          <button
            onClick={() => {
              onClose(); // Close the AuthModal
              onOpenLogin(); // Open the LoginModal
            }}
            className="px-4 py-2 text-black bg-blue-600 rounded-md"
          >
            Login here
          </button>
        </div>
      </div>
    </div>
  );
}
