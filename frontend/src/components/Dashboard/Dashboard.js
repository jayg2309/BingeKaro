import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import TopNavbar from './TopNavbar';
import MyLists from './MyLists';
import ExploreLists from './ExploreLists';
import Profile from './Profile';
import ListView from './ListView';
import UserProfile from './UserProfile';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Top Navigation Bar */}
      <TopNavbar />

      {/* Main content area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard/my-lists" replace />} />
          <Route path="/my-lists" element={<MyLists />} />
          <Route path="/explore" element={<ExploreLists />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/list/:id" element={<ListView />} />
          <Route path="/user/:username" element={<UserProfile />} />
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;
