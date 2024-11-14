'use client'

import { useState } from 'react';

interface LoginModalProps {
  onClose: () => void;
}

export default function LoginModal({ onClose }: LoginModalProps) {
  const [branchCode, setBranchCode] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!branchCode || !password) {
      setErrorMessage('Branch code and password are required');
      return;
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ branchCode, password }),
      });

      const result = await response.json();

      if (response.ok) {
        setErrorMessage(null); // Clear any previous error messages
        onClose();
        window.location.href = '/dashboard'; // Redirect to dashboard or preferred page
      } else {
        setErrorMessage(result.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Failed to log in. Please try again.');
    }
  };

  const handleRegister = () => window.location.href = '/sign-up';
  const handleResetPassword = () => window.location.href = '/reset-password';

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 backdrop-blur-sm z-50">
      <div className="relative bg-white rounded-lg shadow-lg p-6 w-[40%] max-w-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>

        <h2 className="text-xl text-blue-600 font-bold mb-4">Login</h2>

        {/* Display error message */}
        {errorMessage && (
          <div className="mb-4 text-red-600 font-bold">
            {errorMessage}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block mb-2 text-gray-700">Branch Code</label>
            <input
              type="text"
              name="branchCode"
              value={branchCode}
              onChange={(e) => setBranchCode(e.target.value)}
              className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md"
              placeholder="Enter Branch Code"
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md"
              placeholder="Enter Password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-600 rounded-md"
          >
            Login
          </button>
        </form>

        <div className="flex justify-between mt-4 text-sm text-blue-500">
          <button onClick={handleRegister} className="hover:underline">
            Not registered? Register here
          </button>
          <button onClick={handleResetPassword} className="hover:underline">
            Forgot password?
          </button>
        </div>
      </div>
    </div>
  );
}
