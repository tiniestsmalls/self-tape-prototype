import { CharacterLine } from "../ScriptPage.tsx";

export async function playAudio(scriptId: string, line: CharacterLine, i: number, setLineIndex: (index: number) => void) {
    console.log(`\n[${line.character}]: ${line.line}`);
        const lineIndex = `${i}_${line.character.replace(/ /g, '_')}`;
        try {
          const response = await fetch(`http://18.118.198.25:3001/api/get-audio?scriptId=${scriptId}&lineIndex=${lineIndex}`, {
            method: 'GET'
          });
          if (!response.ok) {
            throw new Error('Failed to play audio');
          }
          const blob = await response.blob();
          const audioUrl = URL.createObjectURL(blob);
          const audio = new Audio(audioUrl);
          await new Promise(resolve => {
            audio.play();
            audio.onended = () => resolve(true);
          });
          setLineIndex(i + 1);
        } catch (error) {
          console.error('Error playing audio:', error);
        }
    }