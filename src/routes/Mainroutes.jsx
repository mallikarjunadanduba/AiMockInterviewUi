import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../Layouts/MainLayouts/Header/index';
import FinalReport from '../components/Report/FinalReport ';

// Lazy-loaded components
const InvitationForm = lazy(() => import('../components/Interview/InvitationForm'));
const InterviewSession = lazy(() => import('../pages/InterviewSession'));

const NotFound = () => <div>404 - Page Not Found</div>;

const Mainroutes = () => {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>}>
        <Routes>
          <Route path="/" element={<InvitationForm />} />
          <Route path="/interview" element={<Navigate to="/interview/demo-session-id" />} />
          <Route path="/interview/:sessionId" element={<InterviewSession />} />
          <Route path="/finalreport/:sessionId" element={<FinalReport />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default Mainroutes;
