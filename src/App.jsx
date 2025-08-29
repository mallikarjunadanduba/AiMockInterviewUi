import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Mainroutes from './routes/Mainroutes';
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Mainroutes />
    </BrowserRouter>
  );
}

export default App;
