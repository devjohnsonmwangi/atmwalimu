import { useState } from 'react';

// The hook returns the download function, loading state, and error state
export const useFileDownloader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadFile = async (url: string, filename: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Fetch the file from the URL
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      // 2. Get the response data as a Blob (Binary Large Object)
      const blob = await response.blob();

      // 3. Create a temporary URL for the blob
      const objectUrl = window.URL.createObjectURL(blob);

      // 4. Create a temporary <a> element to trigger the download
      const link = document.createElement('a');
      link.href = objectUrl;
      link.setAttribute('download', filename); // Set the desired file name
      document.body.appendChild(link);
      
      // 5. Programmatically click the link to start the download
      link.click();

      // 6. Clean up by removing the link and revoking the object URL
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(objectUrl);

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred during download.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { downloadFile, isLoading, error };
};