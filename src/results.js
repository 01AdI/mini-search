import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import useTypingEffect from "./components/ui/useTypingEffect";
import { Meteors } from "./components/ui/meteors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Link } from "react-router";


export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [results, setResults] = useState([]);
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const animatedResponse = useTypingEffect(aiResponse, 20);

  


  // 🧠 On page load
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("query") || "";
    setQuery(q);
    if (q) performSearch(q);
  }, [location.search]);

  // 🧠 Perform search
  const performSearch = async (q) => {
    try {
      setLoading(true);
      setAiResponse("✨ Generating AI summary...");

      // 1️⃣ Gemini API
      const genAI = new GoogleGenerativeAI(
        "AIzaSyApmfVtrWV5Td_qbjBa0RtX-RFqN81i2pI"
      );
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `Provide a concise, human-friendly web summary for the topic "${q}" in 5–6 lines max.`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();
      setAiResponse(` Here's what I found about "${q}":\n${text}`);

      // 2️⃣ Serper API (search + images)
      try {
        const res = await fetch("https://google.serper.dev/search", {
          method: "POST",
          headers: {
            "X-API-KEY": "b79b8c411fb41015dbc1410ece5a6296320337be",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ q }),
        });

        const data = await res.json();
        console.log("Serper API Response:", data);

        // Map organic results
        const organicResults = data.organic?.map((item) => ({
          title: item.title,
          link: item.link,
          favicon: `https://www.google.com/s2/favicons?sz=64&domain_url=${item.link}`,
          description: item.snippet || "No description available.",
        }));

        setResults(organicResults || []);

         // 🖼️ SERPER IMAGE SEARCH (separate endpoint)
    const imageRes = await fetch("https://google.serper.dev/images", {
      method: "POST",
      headers: {
        "X-API-KEY": "b79b8c411fb41015dbc1410ece5a6296320337be",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ q }),
    });

    const imageData = await imageRes.json();
    console.log("🖼️ Serper Image Response:", imageData);

    let imageArray = [];

    if (imageData.images && imageData.images.length > 0) {
      imageArray = imageData.images
        .slice(0, 6)
        .map(
          (img) =>
            img.imageUrl ||
            img.thumbnailUrl ||
            img.source ||
            img.url ||
            null
        )
        .filter(Boolean);
    }

    // 🔁 Fallback to Unsplash
    if (imageArray.length === 0) {
      imageArray = Array.from(
        { length: 5 },
        (_, i) =>
          `https://source.unsplash.com/600x400/?${encodeURIComponent(
            q
          )}&sig=${i}`
      );
    }

    setImageUrls(imageArray);

      } catch (err) {
        console.error("Serper API error:", err);
        setResults([]);
        setImageUrls(
          Array.from(
            { length: 5 },
            (_, i) =>
              `https://source.unsplash.com/600x400/?${encodeURIComponent(
                q
              )}&sig=${i}`
          )
        );
      }
    } catch (error) {
      console.log("Search Error:", error);
      setAiResponse("⚠️ Sorry, something went wrong fetching results.");
      setResults([]);
      setImageUrls([]);
    } finally {
      setLoading(false);
    }
  };

  // 🧩 Undo / Redo / Search
  const handleSearch = () => {
    if (!query.trim()) return;
    setUndoStack([...undoStack, query]);
    setRedoStack([]);
    navigate(`/results?query=${encodeURIComponent(query)}`);
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const last = undoStack[undoStack.length - 1];
    setRedoStack([query, ...redoStack]);
    setUndoStack(undoStack.slice(0, -1));
    setQuery(last);
    navigate(`/results?query=${encodeURIComponent(last)}`);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    setUndoStack([...undoStack, query]);
    setRedoStack(redoStack.slice(1));
    setQuery(next);
    navigate(`/results?query=${encodeURIComponent(next)}`);
  };

  const ShimmerCard = () => (
    <div className="animate-pulse flex items-start space-x-4 bg-gray-900/50 border border-gray-800 rounded-xl p-5">
      <div className="w-8 h-8 bg-gray-700 rounded-md" />
      <div className="space-y-3 flex-1">
        <div className="h-4 bg-gray-700 rounded w-1/3"></div>
        <div className="h-3 bg-gray-700 rounded w-2/3"></div>
        <div className="h-3 bg-gray-700 rounded w-1/4"></div>
      </div>
    </div>
  );

  // 🧱 Render UI
  return (
    <div className="min-h-screen bg-black text-gray-200 p-6">
      
      {/* 🔹 Topbar */}
      <header className="flex items-center justify-between bg-gray-900/70 rounded-xl border border-gray-700/50 px-6 py-3 shadow-lg backdrop-blur-lg">
        <Link to="/">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent cursor-pointer">
          Nova Search
        </h1>
        </Link>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleUndo}
            className="px-3 py-2 text-xl text-cyan-400 hover:text-cyan-300 cursor-pointer"
          >
            ←
          </button>
          <button
            onClick={handleRedo}
            className="px-3 py-2 text-xl text-cyan-400 hover:text-cyan-300 cursor-pointer"
          >
            →
          </button>
          <input
            type="text"
            className="bg-gray-800/80 px-4 py-2 rounded-lg outline-none w-80 text-gray-200 placeholder-gray-400"
            placeholder="Search the web..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="px-5 py-2 bg-gradient-to-r cursor-pointer from-cyan-500 to-blue-500 rounded-lg text-white font-semibold hover:shadow-[0_0_15px_rgba(0,255,255,0.3)]"
          >
            Search
          </button>
        </div>
      </header>

      {/* 🔹 AI Summary */}
      <section className="relative mt-8 w-full">
        <div className="absolute inset-0 h-full w-full scale-[0.80] transform rounded-full bg-gradient-to-r from-blue-500 to-teal-500 blur-3xl" />

        <div className="relative flex flex-col items-start justify-end overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/80 px-6 py-8 shadow-xl backdrop-blur-md">
          <h2 className="relative z-10 mb-3 text-xl font-bold text-cyan-400">
            ✨ AI Summary
          </h2>

          <p className="relative z-10 text-gray-300 leading-relaxed whitespace-pre-line transition-all duration-500">
            {loading ? (
              <span className="animate-pulse text-cyan-400">
                Thinking... 💡
              </span>
            ) : (
              <>
                {animatedResponse}
                <span className="animate-pulse text-cyan-400">▋</span>
              </>
            )}
          </p>

          <Meteors number={15} />
        </div>
      </section>

   
      {/* 🔹 Image Strip (Horizontal Scroll) */}
{imageUrls.length > 0 && (
  <div className="mt-8 overflow-x-auto scrollbar-thin scrollbar-thumb-cyan-500/50 scrollbar-track-gray-800/50">
    <div className="flex space-x-4 min-w-max px-2 py-2  cursor-pointer">
      {imageUrls.map((url, i) => (
        <img
          key={i}
          src={url}
          alt={`Search visual ${i}`}
          className="rounded-xl w-64 h-40 object-cover flex-shrink-0 border border-gray-700/40 hover:scale-105 transition-transform duration-300"
        />
      ))}
    </div>
  </div>
)}


      {/* 🔹 Results */}
      <section className="mt-10 space-y-6">
        {loading ? (
          // show 4 shimmer cards
          [...Array(4)].map((_, i) => <ShimmerCard key={i} />)
        ) : results.length > 0 ? (
          results.map((r, i) => (
            <div
              key={i}
              className="flex items-start cursor-pointer space-x-4 bg-gradient-to-r from-gray-900/60 to-gray-800/60 border border-gray-700/50 rounded-xl p-5 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all duration-300 cursor-pointer"
            >
              <img src={r.favicon} alt="" className="w-8 h-8 rounded-md mt-1" />
              <div>
                <a
                  href={r.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-semibold text-cyan-400 hover:text-cyan-300"
                >
                  {r.title}
                </a>
                <p className="text-gray-400 mt-1">{r.description}</p>
                <p className="text-gray-500 text-sm mt-1">{r.link}</p>
              </div>
            </div>
          ))
        ) : (
          // No results found message
          <p className="text-center text-gray-400 text-lg mt-10">
            ❌ No results found for{" "}
            <span className="text-cyan-400">"{query}"</span>
          </p>
        )}
      </section>
    </div>
  );
}
