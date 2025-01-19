import React, { useEffect, useState } from 'react';

interface CharacterLine {
      character?: string;
      line?: string;
    };


export function ScriptPage() {
  const [scriptData, setScriptData] = useState<Array<CharacterLine>>([]);

  useEffect(() => {
    const scriptContent = localStorage.getItem('extractedScript');
    console.log(scriptContent);
    if (scriptContent) {
      setScriptData(JSON.parse(scriptContent));
    }
  }, []);

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

      <h3>{'Script Content'}</h3>
          {scriptData.map((dialogue, dIndex) => (
            <div key={dIndex} className="dialogue">
              <div className="character">{dialogue.character}</div>
              <div className="line">{dialogue.line}</div>
            </div>
          ))}
    </div>
  );
} 