import React, { useState } from "react";

function App() {
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [platform, setPlatform] = useState("Instagram");

  // Function to handle platform change
  const handlePlatformChange = (event) => {
    setPlatform(event.target.value);
  };

  const generateCaption = async () => {
    setLoading(true);
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    const promptText = `Write a creative caption for a ${platform} post featuring a photo of a cat in sunglasses.`;

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
                {
                  text: promptText,
                },
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
      setCaption(result || "No caption generated.");
    } catch (error) {
      console.error("Error fetching data: ", error);
      setCaption("Failed to generate caption. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6">
      <div className="max-w-md w-full p-6 bg-white rounded-xl shadow-xl">
        {/* Caption Generator Heading */}
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Caption Generator</h1>

        {/* Dropdown for selecting platform */}
        <div className="mb-6">
          <label htmlFor="platform" className="block text-xl text-gray-700 mb-2">Select Platform:</label>
          <select
            id="platform"
            value={platform}
            onChange={handlePlatformChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="Instagram">Instagram</option>
            <option value="Facebook">Facebook</option>
            <option value="Twitter">Twitter</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="YouTube">YouTube</option>
          </select>
        </div>

        {/* Generate Caption Button */}
        <button
          className="w-full bg-blue-600 text-white py-3 rounded-lg shadow-lg transform transition-all duration-300 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500"
          onClick={generateCaption}
        >
          {loading ? "Generating..." : "Generate Caption"}
        </button>

        {/* Section to display the generated caption */}
        <div className="mt-6">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Generated Caption:</h3>
          <div className="bg-gray-100 p-6 rounded-lg shadow-xl space-y-4">
            <p className="text-lg text-gray-800 italic">{caption}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
