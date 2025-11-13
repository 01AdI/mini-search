// src/App.jsx
import React from "react";
import { SparklesCore } from "./components/ui/sparkles";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function App(){
    
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

  const handleSearch = () => {
    if (!query.trim()) return;
    navigate(`/results?query=${encodeURIComponent(query)}`);
  };

  


  return (
    <div className="h-[100vh] w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md">
      <h1 className="text-6xl md:text-8xl lg:text-9xl font-extrabold text-center bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(56,189,248,0.6)] tracking-tight select-none">
        Nova Search
      </h1>

      <div className="w-[40rem] h-40 relative">
        {/* Gradients */}
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />

        {/* Core component */}
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={1200}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />

        {/* Radial Gradient */}
        <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
      </div>

      <div className="search-container flex items-center justify-center w-full max-w-xl mx-auto mt-8 bg-gradient-to-r from-gray-900/60 via-gray-800/50 to-gray-900/60 backdrop-blur-md rounded-2xl border border-gray-700/60 shadow-[0_0_15px_rgba(0,255,255,0.2)] p-2 transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,255,255,0.4)]">
        <input
          type="text"
          placeholder="Search the web..."
          className="flex-1 bg-transparent text-gray-200 placeholder-gray-400 outline-none px-4 py-2 text-lg focus:ring-0"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          onClick={handleSearch}
          id="searchBtn"
          className="ml-3 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl shadow-[0_0_10px_rgba(0,255,255,0.3)] hover:shadow-[0_0_20px_rgba(0,255,255,0.5)] transition-all duration-300 active:scale-95"
        >
          Search
        </button>
      </div>

      <main id="results-container"></main>
    </div>
  );
};
