import React, { useEffect, useState } from 'react';
import { playAudio } from './scripts/playAudio';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { fuzzy } from 'fast-fuzzy';

export interface CharacterLine {
      character: string;
      line: string;
    };

export function ScriptPage() {
    
  const [scriptData, setScriptData] = useState<Array<CharacterLine>>([]);
  const [lineIndex, setLineIndex] = useState(-1);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordingChunks, setRecordingChunks] = useState<Blob[]>([]);

  useEffect(() => {
  const scriptContent = localStorage.getItem('extractedScript');
    console.log(scriptContent);
    if (scriptContent) {
      setScriptData(JSON.parse(scriptContent));
    }
  }, []);
  
  const {
    listening,
    transcript,
    resetTranscript,
  } = useSpeechRecognition();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ 
        video: true, 
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        }
      })
      .then((stream) => {
        const videoElement = document.getElementById("video") as HTMLVideoElement;
        if (videoElement) {
          videoElement.srcObject = stream;
          videoElement.muted = true;
          (window as any).stream = stream;
        }
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
      });
  }, []);

  useEffect(() => {
    console.log(listening);
    console.log(transcript)
    console.log(lineIndex);
    if (lineIndex < scriptData.length && lineIndex >= 0) {
        const line = scriptData[lineIndex];
        if (line.character === localStorage.getItem('userCharacterName')) {
            if (!listening) {
                if (fuzzy(transcript, line.line, { ignoreSymbols: true, ignoreCase: true }) > 0.5) {
                    setLineIndex(lineIndex + 1);
                } else {
                    resetTranscript();
                    SpeechRecognition.startListening();
                }
            }
        } else {
            playAudio(localStorage.getItem('scriptId')!, line, lineIndex, setLineIndex);
        }
    }
  }, [lineIndex, listening]);

  const startRecording = () => {
    const stream = (window as any).stream;
    if (stream) {
      const recorder = new MediaRecorder(stream);
      setRecordingChunks([]);
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordingChunks(chunks => [...chunks, event.data]);
        }
      };
      
      recorder.start(1000);
      setMediaRecorder(recorder);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.requestData();
      mediaRecorder.stop();
      
      setTimeout(() => {
        const blob = new Blob(recordingChunks, { type: 'video/webm; codecs=vp9' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'readthrough-recording.webm';
        a.click();
        URL.revokeObjectURL(url);
        setRecordingChunks([]);
      }, 200);
    }
  };

  useEffect(() => {
    if (lineIndex >= scriptData.length && mediaRecorder) {
      setTimeout(() => {
        stopRecording();
      }, 5000);
    }
  }, [lineIndex, scriptData.length, mediaRecorder]);

  return (
    <div>
      <header>Audition App - Script Page</header>

      <div className="container">
        <div className="camera">
          <video id="video" autoPlay playsInline></video>
        </div>

        <div className="script-container">
          <button
            className="start-button"
            onClick={async () => {
              if (!localStorage.getItem('userCharacterName')) {
                alert('No character name found. Please upload the script again.');
                return;
              }
              if (!localStorage.getItem('scriptId')) {
                alert('No script ID found. Please upload the script again.');
                return;
              }
              startRecording();
              await SpeechRecognition.startListening();
              setLineIndex(0);
            }}
          >
            Start Readthrough
          </button>

          {scriptData.map((dialogue, dIndex) => (
            <div key={dIndex} className="line">
              <span className="character">{dialogue.character}:</span>{' '}
              <span style={{color: lineIndex === dIndex ? 'red' : 'inherit'}}>{dialogue.line}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: Arial, sans-serif;
        }

        header {
          background-color: #f5f5f5;
          padding: 10px;
          text-align: center;
          font-size: 20px;
          font-weight: bold;
          border-bottom: 1px solid #ccc;
        }

        .container {
          display: flex;
          height: calc(100vh - 100px);
        }

        .camera {
          flex: 1;
          background-color: #eaeaea;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .camera video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .script-container {
          flex: 1;
          background-color: #fff;
          padding: 20px;
          overflow-y: auto;
          border-left: 1px solid #ccc;
        }

        .line {
          margin-bottom: 10px;
        }

        .character {
          font-weight: bold;
          color: #007bff;
        }

        .start-button {
          padding: 10px 20px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          margin-bottom: 20px;
        }

        .start-button:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
} 