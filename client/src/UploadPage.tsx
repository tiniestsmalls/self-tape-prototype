import { ScriptUploader } from './components/ScriptUploader';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export function UploadPage() {
  const navigate = useNavigate();

  const handleSubmit = async (characterName: string, file: File) => {
    // Here you can send the file to your backend
    const formData = new FormData();
    formData.append('file', file);
    formData.append('characterName', characterName);

    try {
      const response = await fetch('http://localhost:3001/api/parse-script', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      console.log(data);
      localStorage.setItem('userCharacterName', characterName);
      localStorage.setItem('extractedScript', JSON.stringify(data.scriptContent));
      localStorage.setItem('scriptId', data.resultPath);
      navigate('/script');
    } catch (error) {
      console.error('Error:', error);
      throw error; // This will be caught by the ScriptUploader component
    }
  };

  return (
    <div>
      <style>{`
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
        }

        h1 {
          text-align: center;
        }

        .container {
          max-width: 500px;
          margin: 0 auto;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
        }

        .error {
          color: red;
          text-align: center;
          margin-bottom: 10px;
        }

        label {
          display: block;
          margin: 10px 0 5px;
        }

        input[type="text"],
        input[type="file"] {
          width: 100%;
          padding: 8px;
          box-sizing: border-box;
        }

        button {
          padding: 10px 20px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
      `}</style>
      <h1>Upload Your Script</h1>
      <ScriptUploader onSubmit={handleSubmit} />
    </div>
  );
}