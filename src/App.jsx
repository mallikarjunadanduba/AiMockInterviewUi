import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Mainroutes from './routes/Mainroutes';
import '../src/app.css'

function App() {
  return (
    <BrowserRouter>
      <Mainroutes />
    </BrowserRouter>
  );
}

export default App;
