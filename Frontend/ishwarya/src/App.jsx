import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

/* Component imports */
import AdminLayout from './admin/AdminLayout';
import Students from './admin/Students';
import Class from './admin/Class';
import AdminTests from './admin/Tests';
import AdminNotes from './admin/Notes';
import AdminProfile from './admin/Profile';
import UserLayout from './user/UserLayout';
import Dashboard from './user/Dashboard';

import UserTests from './user/Tests';
import UserNotes from './user/Notes';
import UserProfile from './user/Profile';

import ContentPage from './user/ContentPage';

import Login from './enter/login';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/enter/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="students" element={<Students />} />
          <Route path="class" element={<Class />} />
          <Route path="tests" element={<AdminTests />} />
          <Route path="notes" element={<AdminNotes />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>
        <Route path="/user" element={<UserLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          
          <Route path="tests" element={<UserTests />} />
         
          <Route path="notes" element={<UserNotes />} />
          <Route path="profile" element={<UserProfile />} />
         
          <Route path="content" element={<ContentPage />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
