'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ScrapeResult {
  success: boolean;
  verses: string[];
  textContent: string;
  filename: string;
  count: number;
}

export default function Home() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ScrapeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewVerses, setPreviewVerses] = useState<string[]>([]);

  const handleScrape = async () => {
    if (!url.trim()) {
      setError('Please enter a Rekhta URL');
      return;
    }

    if (!url.includes('rekhta.org')) {
      setError('Please enter a valid Rekhta.org URL');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);
    setPreviewVerses([]);

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to scrape the page');
      }

      setResult(data);
      setPreviewVerses(data.verses.slice(0, 3)); // Show first 3 verses as preview
    } catch (err: any) {
      setError(err.message || 'An error occurred while scraping');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadFile = () => {
    if (!result) return;

    const blob = new Blob([result.textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async () => {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(result.textContent);
      alert('Text copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Rekhta Ghazal Scraper
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Extract Urdu verses from Rekhta.org ghazals and download them as text files
          </p>
        </div>

        {/* Main Form */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
            <div className="mb-6">
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rekhta URL
              </label>
              <div className="flex gap-4">
                <input
                  type="url"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.rekhta.org/ghazals/..."
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  disabled={isLoading}
                />
                <button
                  onClick={handleScrape}
                  disabled={isLoading || !url.trim()}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Scraping...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Extract Verses
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            {/* Success Result */}
            {result && (
              <div className="space-y-6">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-400 mb-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Successfully extracted {result.count} verses!
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-300">
                    File will be saved as: <code className="bg-green-100 dark:bg-green-800 px-2 py-1 rounded">{result.filename}</code>
                  </p>
                </div>

                {/* Preview */}
                {previewVerses.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Preview (first 3 verses):</h3>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 max-h-48 overflow-y-auto">
                      {previewVerses.map((verse, index) => (
                        <div key={index} className="text-right text-lg leading-relaxed mb-3 text-gray-800 dark:text-gray-200">
                          {verse}
                        </div>
                      ))}
                      {result.count > 3 && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                          ... and {result.count - 3} more verses
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={downloadFile}
                    className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download Text File
                  </button>
                  <button
                    onClick={copyToClipboard}
                    className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy to Clipboard
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">How to Use</h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                  1
                </div>
                <p>Go to <a href="https://www.rekhta.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Rekhta.org</a> and find a ghazal you want to extract</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                  2
                </div>
                <p>Copy the URL of the ghazal page (make sure it's in Urdu language mode)</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                  3
                </div>
                <p>Paste the URL above and click "Extract Verses"</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                  4
                </div>
                <p>Download the extracted verses as a text file or copy to clipboard</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
