import React, { useState } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function App() {
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [platform, setPlatform] = useState("Instagram");
  const [event, setEvent] = useState("");

  const handlePlatformChange = (event) => {
    setPlatform(event.target.value);
  };

  const handleEventChange = (e) => {
    setEvent(e.target.value);
  };

  const generateCaption = async () => {
    setLoading(true);
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    const promptText = `Write a creative caption for a ${platform} post based on this theme: "${event}". Keep it engaging and fun.`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: promptText },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();
      const result = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      setCaption(result || "Couldn't generate a caption. Try again!");
    } catch (error) {
      console.error("Error fetching data:", error);
      setCaption("Failed to generate caption. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-[#fef9f4] p-8">
      <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-md">
        
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8 tracking-wide">
           Caption Creator
        </h1>

        <div className="mb-6">
          <label htmlFor="platform" className="block text-lg font-semibold text-gray-700 mb-2">
            Choose your Platform:
          </label>
          <select
            id="platform"
            value={platform}
            onChange={handlePlatformChange}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option>Instagram</option>
            <option>Facebook</option>
            <option>Twitter</option>
            <option>LinkedIn</option>
            <option>YouTube</option>
          </select>
        </div>

        <div className="mb-6">
          <label htmlFor="event" className="block text-lg font-semibold text-gray-700 mb-2">
            What's the Vibe? (event/emotion)
          </label>
          <input
            type="text"
            id="event"
            value={event}
            onChange={handleEventChange}
            placeholder="like happy, sports, party..."
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
        </div>

        <button
          onClick={generateCaption}
          disabled={loading || event.trim() === ""}
          className="w-full py-3 bg-gradient-to-r from-purple-400 to-pink-400 text-white font-semibold rounded hover:opacity-90 transition"
        >
          {loading ? "Thinking..." : "Generate Caption"}
        </button>

        <div className="mt-8">
          <h3 className="text-2xl font-bold text-gray-700 mb-4"> Generated Caption:</h3>
          <div className="p-4 bg-gray-100 rounded shadow-sm min-h-[120px]">
            <p className="text-gray-800 text-md leading-relaxed"><ReactMarkdown>{caption}</ReactMarkdown></p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
