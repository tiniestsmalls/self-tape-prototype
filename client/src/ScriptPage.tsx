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

  return (
    <div className="script-container">
      <style>{`
        .script-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .scene {
          margin-bottom: 30px;
          padding: 15px;
          background-color: #f5f5f5;
          border-radius: 8px;
        }
        
        .location {
          font-weight: bold;
          color: #444;
          margin-bottom: 10px;
        }
        
        .dialogue {
          margin: 10px 0;
          padding-left: 20px;
        }
        
        .character {
          color: #2c5282;
          font-weight: 600;
        }
        
        .line {
          margin-left: 20px;
          color: #333;
        }
      `}</style>

      <button
        className="readthrough-button"
        onClick={async () => {
            if (!localStorage.getItem('userCharacterName')) {
                alert('No character name found. Please upload the script again.');
                return;
            }
            if (!localStorage.getItem('scriptId')) {
                alert('No script ID found. Please upload the script again.');
                return;
            }
            await SpeechRecognition.startListening();
            setLineIndex(0);
        }}
      >
        Start Readthrough
      </button>
      <style>{`
        .readthrough-button {
          padding: 10px 20px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          margin-bottom: 20px;
        }

        .readthrough-button:hover {
          background-color: #0056b3;
        }
      `}</style>


      <h3>{'Script Content'}</h3>
          {scriptData.map((dialogue, dIndex) => (
            <div key={dIndex} className="dialogue">
              <div className="character">{dialogue.character}</div>
              <div className="line" style={{color: lineIndex === dIndex ? 'red' : 'black'}}>{dialogue.line}</div>
            </div>
          ))}
    </div>
  );
} 