import React from 'react';
import { Outlet } from 'react-router-dom';
import UserHeader from './UserHeader';
import UserFooter from './UserFooter';

export default function UserLayout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <UserHeader />
      <main style={{ flex: 1, paddingBottom: '60px' }}>
        <Outlet />
      </main>
      <UserFooter />
    </div>
  );
}
