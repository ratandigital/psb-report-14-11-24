import { useState, useEffect } from 'react';
import axios from 'axios';

interface LoginModalProps {
  onClose: () => void;
  onOpenRegister: () => void;
}

export default function LoginModal({ onClose, onOpenRegister }: LoginModalProps) {
  const [branchCode, setBranchCode] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Clear the session cookie on modal load by calling the logout API
  useEffect(() => {
    const clearSession = async () => {
      try {
        await axios.get('/api/logout'); // Call the logout endpoint to clear the session
      } catch (error) {
        console.error('Failed to clear session:', error);
      }
    };
    clearSession();
  }, []); // Empty dependency array to run only once on mount

  const handleLogin = async () => {
    if (!branchCode || !password) {
      setErrorMessage('Branch code and password are required');
      return;
    }

    try {
      const response = await axios.post('/api/login', { branchCode, password });

      if (response.status === 200) {
        setErrorMessage(null); // Clear any previous error messages
        onClose();
        window.location.href = '/dashboard'; // Redirect to the dashboard or preferred page
      } else {
        setErrorMessage(response.data.message || 'Login failed');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(error.response.data.message || 'Login failed');
      } else {
        setErrorMessage('Failed to log in. Please try again.');
      }
    }
  };

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

        {errorMessage && (
          <div className="mb-4 text-red-600 font-bold">{errorMessage}</div>
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

          <button type="submit" className="w-full py-2 text-white bg-blue-600 rounded-md">
            Login
          </button>
        </form>

        <div className="flex justify-between mt-4 text-sm">
          <p className="text-gray-600">Don't have an account?</p>
          <button
            onClick={() => {
              onClose();
              onOpenRegister();
            }}
            className="px-4 py-2 text-black bg-blue-600 rounded-md"
          >
            Register here
          </button>
        </div>
      </div>
    </div>
  );
}
