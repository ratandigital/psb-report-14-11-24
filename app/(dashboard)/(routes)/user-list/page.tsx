

"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import bangladeshData from '@/component/bangladeshData';
import jwt from 'jsonwebtoken';

interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  division: string;
  district: string;
  upazila: string;
  status: string;
  createdAt: string;
}

export default function UserListPage() {
  const router = useRouter();
  const [adminStatus, setAdminStatus] = useState<boolean | null>(null); // Initial state as null to avoid premature redirect


  const [users, setUsers] = useState<User[]>([]);
 
  const [filters, setFilters] = useState({
    division: '',
    district: '',
    upazila: '',
    status: '',
  });
  const [page, setPage] = useState(1);
  const itemsPerPage = 2;

  // Check if the user has "admin" status using JWT from the cookie

  // useEffect(() => {
  //   const token = document.cookie
  //     .split('; ')
  //     .find((row) => row.startsWith('session='))
  //     ?.split('=')[1];

  //   if (token) {
  //     try {
  //       const decodedToken = jwt.decode(token) as { status?: string };
  //       const isAdmin = decodedToken?.status === 'admin';

  //       setAdminStatus(isAdmin);

  //       if (!isAdmin) {
  //         router.push('/'); // Redirect if not admin
  //       }
  //     } catch (error) {
  //       console.error('Token decoding error:', error);
  //       router.push('/'); // Redirect if token is invalid
  //     }
  //   } else {
  //     router.push('/'); // Redirect if no token found
  //   }
  // }, [router]);
  
  // Fetch users with filters and pagination
  useEffect(() => {
    async function fetchUsers() {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        division: filters.division,
        district: filters.district,
        upazila: filters.upazila,
        status: filters.status,
      });
      const res = await fetch(`/api/users?${queryParams}`);
      const data = await res.json();
      setUsers(data.users);
    }
    fetchUsers();
  }, [page, filters]);

  



const handleApproveUser = async (userId: string) => {
  try {
    const res = await fetch(`/api/userss/${userId}/approve`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to approve user');
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, status: 'approved' } : user
      )
    );
  } catch (error) {
    console.error("Error approving user:", error);
  }
};

  
  
const handleMakeAdmin = async (userId: string) => {
  try {
    const res = await fetch(`/api/userss/${userId}/make-admin`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to make user admin');
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, status: 'admin' } : user
      )
    );
  } catch (error) {
    console.error("Error making user admin:", error);
  }
};

const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const { name, value } = e.target;
  setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  setPage(1); // Reset page when filters change
};

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handleRejectUser = async (userId: string) => {
    try {
      const res = await fetch(`/api/users/${userId}/reject`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to reject user');
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, status: 'rejected' } : user
        )
      );
    } catch (error) {
      console.error("Error rejecting user:", error);
    }
  };
  

  // if (adminStatus === null) return null;
  const handleLockUser = async (userId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'locked' ? 'approved' : 'locked';
      const res = await fetch(`/api/users/${userId}/lock`, {
        method: 'POST',
        body: JSON.stringify({ status: newStatus }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error(`Failed to ${newStatus === 'locked' ? 'lock' : 'unlock'} user`);
      
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );
    } catch (error) {
      console.error("Error locking/unlocking user:", error);
    }
  };
  

  const resetFilters = () => {
    setFilters({
      division: '',
      district: '',
      upazila: '',
      status: '',
    });
    setPage(1); // Reset to the first page
  };
  

  return (
    <div className="p-4">
      <nav className="bg-gray-800 text-white p-4 rounded mb-6">
        <h1 className="text-lg font-bold">Admin Dashboard</h1>
      </nav>
      <h1 className="text-lg font-bold">User List</h1>
      <div className="flex flex-wrap text-center gap-4 mb-6">
  <select
    name="division"
    value={filters.division}
    onChange={handleFilterChange}
    className="px-2 py-1 border rounded"
  >
    <option value="">All Divisions</option>
    {Object.keys(bangladeshData).map((division) => (
      <option key={division} value={division}>
        {division}
      </option>
    ))}
  </select>
  <select
    name="district"
    value={filters.district}
    onChange={handleFilterChange}
    className="px-2 py-1 border rounded"
  >
    <option value="">All Districts</option>
    {filters.division &&
      Object.keys(bangladeshData[filters.division]?.districts || {}).map(
        (district) => (
          <option key={district} value={district}>
            {district}
          </option>
        )
      )}
  </select>
  <select
    name="upazila"
    value={filters.upazila}
    onChange={handleFilterChange}
    className="px-2 py-1 border rounded"
  >
    <option value="">All Upazilas</option>
    {filters.division &&
      filters.district &&
      bangladeshData[filters.division]?.districts[
        filters.district
      ]?.map((upazila) => (
        <option key={upazila} value={upazila}>
          {upazila}
        </option>
      ))}
  </select>
  <select
    name="status"
    value={filters.status}
    onChange={handleFilterChange}
    className="px-2 py-1 border rounded"
  >
    <option value="">All Statuses</option>
    <option value="pending">Pending</option>
    <option value="approved">Approved</option>
    <option value="admin">Admin</option>
    <option value="locked">Locked</option>
  </select>
  
  {/* Reset Filters Button */}
  <button
    onClick={resetFilters}
    className="px-4 py-2 bg-gray-500 text-white rounded"
  >
    Reset Filters
  </button>
</div>


      <table className="w-full bg-white rounded shadow overflow-hidden">
        <thead>
          <tr className="bg-gray-200 text-left text-sm font-semibold text-gray-700">
            <th className="p-3">Created At</th>
            <th className="p-3">Username</th>
            <th className="p-3">Email</th>
            <th className="p-3">Phone</th>
            <th className="p-3">Division</th>
            <th className="p-3">District</th>
            <th className="p-3">Upazila</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-gray-200">
              <td className="p-3">{new Date(user.createdAt).toLocaleDateString()}</td>
              <td className="p-3">{user.username}</td>
              <td className="p-3">{user.email}</td>
              <td className="p-3">{user.phone}</td>
              <td className="p-3">{user.division}</td>
              <td className="p-3">{user.district}</td>
              <td className="p-3">{user.upazila}</td>
              <td className="p-3">{user.status}</td>
              <td className="p-3">
  {user.status === 'pending' && (
    <>
      <button
        onClick={() => handleApproveUser(user.id)}
        className="px-2 py-1 bg-green-500 text-white rounded"
      >
        Approve
      </button>
      <button
        onClick={() => handleRejectUser(user.id)}
        className="px-2 py-1 bg-red-500 text-white rounded ml-2"
      >
        Reject
      </button>
    </>
  )}
  {user.status === 'approved' && (
    <button
      onClick={() => handleMakeAdmin(user.id)}
      className="px-2 py-1 bg-blue-500 text-white rounded ml-2"
    >
      Make Admin
    </button>
  )}
  {user.status !== 'pending' && (
    <button
      onClick={() => handleLockUser(user.id, user.status)}
      className={`px-2 py-1 ${user.status === 'locked' ? 'bg-gray-500' : 'bg-yellow-500'} text-white rounded ml-2`}
    >
      {user.status === 'locked' ? 'Unlock' : 'Lock'}
    </button>
  )}
</td>

            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <button onClick={() => handlePageChange(page - 1)} disabled={page <= 1} className="px-3 py-1 bg-gray-300 rounded">
          Previous
        </button>
        <span>Page {page}</span>
        <button onClick={() => handlePageChange(page + 1)} disabled={users.length < itemsPerPage} className="px-3 py-1 bg-gray-300 rounded">
          Next
        </button>
      </div>
    </div>
  );
}
