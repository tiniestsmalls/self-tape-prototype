import './App.css'
import { ScriptPage } from './ScriptPage';
import { UploadPage } from './UploadPage';
import { BrowserRouter,Routes, Route } from 'react-router-dom';
import React from 'react';
  

function App() {

  return (
    <BrowserRouter>
     <Routes>
      <Route path="/" element={<UploadPage />} />
      <Route path="/script" element={<ScriptPage />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
