import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PublicRoute } from '@/components/PublicRoute';

// Lazy load components
const Index = React.lazy(() => import('@/pages/Index'));
const Search = React.lazy(() => import('@/pages/Search'));
const Map = React.lazy(() => import('@/pages/Map'));
const PropertyDetails = React.lazy(() => import('@/pages/PropertyDetails'));
const Auth = React.lazy(() => import('@/pages/Auth'));
const EmailConfirmation = React.lazy(() => import('@/pages/EmailConfirmation'));
const Profile = React.lazy(() => import('@/pages/Profile'));
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const PropertyCreate = React.lazy(() => import('@/pages/PropertyCreate'));
const PropertyEdit = React.lazy(() => import('@/pages/PropertyEdit'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));
const ProfileCompletion = React.lazy(() => import('@/pages/ProfileCompletion'));

const AppRoutes: React.FC = () => (
  <React.Suspense fallback={<div>Loading...</div>}>
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<PublicRoute><Index /></PublicRoute>} />
      <Route path="/search" element={<PublicRoute><Search /></PublicRoute>} />
      <Route path="/map" element={<PublicRoute><Map /></PublicRoute>} />
      <Route path="/property/:id" element={<PublicRoute><PropertyDetails /></PublicRoute>} />
      <Route path="/signin" element={<PublicRoute><Auth /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Auth /></PublicRoute>} />
      <Route path="/auth" element={<PublicRoute><Auth /></PublicRoute>} />
      <Route path="/email-confirmation" element={<PublicRoute><EmailConfirmation /></PublicRoute>} />
      
      {/* Protected routes */}
      <Route path="/profile-completion" element={<ProtectedRoute><ProfileCompletion /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/property-create" element={<ProtectedRoute><PropertyCreate /></ProtectedRoute>} />
      <Route path="/property/edit/:id" element={<ProtectedRoute><PropertyEdit /></ProtectedRoute>} />
      <Route path="/favorites" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      
      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </React.Suspense>
);

export default AppRoutes;