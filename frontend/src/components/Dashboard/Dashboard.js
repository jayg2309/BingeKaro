import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import MyLists from './MyLists';
import ExploreLists from './ExploreLists';
import Profile from './Profile';
import ListView from './ListView';
import UserProfile from './UserProfile';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main content */}
      <div className="lg:pl-64 bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen">
        {/* Mobile header */}
        <div className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-700 bg-gray-800 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:hidden">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-300 lg:hidden hover:text-blue-400 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">
            BingeKaro Dashboard
          </div>
        </div>

        {/* Main content area */}
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard/my-lists" replace />} />
              <Route path="/my-lists" element={<MyLists />} />
              <Route path="/explore" element={<ExploreLists />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/list/:id" element={<ListView />} />
              <Route path="/user/:username" element={<UserProfile />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
