import { useState } from 'react';

interface ScriptUploaderProps {
  onSubmit: (characterName: string, file: File) => void;
}

export function ScriptUploader({ onSubmit }: ScriptUploaderProps) {
  const [characterName, setCharacterName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fileInput = event.currentTarget.querySelector<HTMLInputElement>('input[type="file"]');
    const file = fileInput?.files?.[0];

    if (!characterName || !file) {
      setError('Both fields are required to continue.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await onSubmit(characterName, file);
    } catch (error) {
      console.error('Error handling submission:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="character-name">Character Name:</label>
        <input
          id="character-name"
          type="text"
          value={characterName}
          onChange={(e) => setCharacterName(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="file-upload">Upload Script:</label>
        <input
          id="file-upload"
          type="file"
          accept=".pdf"
        />
      </div>

      {error && <div className="error-message">{error}</div>}
      
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Continue'}
      </button>
    </form>
  );
}