import './App.css'
import 'regenerator-runtime/runtime';
import { ScriptPage } from './ScriptPage';
import { UploadPage } from './UploadPage';
import Dictaphone from './Dictaphone';
import { BrowserRouter,Routes, Route } from 'react-router-dom';
import React from 'react';
  

function App() {

  return (
    <BrowserRouter>
     <Routes>
      <Route path="/" element={<UploadPage />} />
      <Route path="/script" element={<ScriptPage />} />
      <Route path="/speech" element={<Dictaphone />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
