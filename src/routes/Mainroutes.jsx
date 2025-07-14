import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../Layouts/MainLayouts/Header/index';
import InvitationForm from '../components/Interview/InvitationForm';
import InterviewSession from '../pages/InterviewSession';


const NotFound = () => <div>404 - Page Not Found</div>;

const Mainroutes = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<InvitationForm />} />
        <Route path="/interview" element={<Navigate to="/session/test123" />} />
        <Route path="/session/:sessionId" element={<InterviewSession />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default Mainroutes;
