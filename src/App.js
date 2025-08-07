import React, { useEffect, useState } from "react";

const COLORS = {
  particle: "text-green-500 dark:text-green-400",
  verb: "text-blue-500 dark:text-blue-400",
  noun: "text-purple-600 dark:text-purple-400",
  pronoun: "text-pink-500 dark:text-pink-400",
  default: "text-gray-800 dark:text-gray-100",
};

const App = () => {
  const [stories, setStories] = useState([]);
  const [hideDiacritics, setHideDiacritics] = useState(false);
  const [hideEnglish, setHideEnglish] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null);
  const [showToggles, setShowToggles] = useState(true);
  const [hideTogglesAnim, setHideTogglesAnim] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetch("/content.json")
      .then((res) => res.json())
      .then((data) => setStories(data.stories || []))
      .catch((err) => console.error("Failed to load content:", err));
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className={
      "text-right px-2 sm:px-8 py-4 sm:py-8 font-[Amiri] min-h-screen transition-colors duration-300 " +
      (darkMode
        ? "bg-gradient-to-br from-gray-900 via-blue-950 to-gray-800 text-gray-100"
        : "bg-gradient-to-br from-white via-blue-50 to-blue-100 text-gray-900")
    }>
      {/* Floating toggle switches with hamburger menu */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
        {!showToggles && (
          <button
            className="mb-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg p-3 transition-all flex items-center justify-center"
            title="إظهار الإعدادات"
            onClick={() => setShowToggles(true)}
          >
            {/* Hamburger icon */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="7" width="16" height="2" rx="1" fill="currentColor"/>
              <rect x="4" y="11" width="16" height="2" rx="1" fill="currentColor"/>
              <rect x="4" y="15" width="16" height="2" rx="1" fill="currentColor"/>
            </svg>
          </button>
        )}
        <div
          className={`transition-all duration-300 ${
            showToggles && !hideTogglesAnim
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-4 pointer-events-none"
          }`}
          style={{
            transitionProperty: "opacity, transform",
          }}
        >
          {(showToggles || hideTogglesAnim) && (
            <div className={
              "relative flex flex-col gap-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 min-w-[220px] transition-colors"
            }>
              <button
                className="absolute -top-4 -left-4 sm:-top-5 sm:-left-5 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 p-2 shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                title="إخفاء الإعدادات"
                onClick={() => {
                  setHideTogglesAnim(true);
                  setTimeout(() => {
                    setShowToggles(false);
                    setHideTogglesAnim(false);
                  }, 300);
                }}
                style={{ zIndex: 10 }}
              >
                {/* Close (X) icon */}
                <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
                  <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
              {/* Toggle for Hide Harakāt */}
              <label className="inline-flex items-center cursor-pointer group mt-2">
                <input
                  type="checkbox"
                  checked={hideDiacritics}
                  onChange={() => setHideDiacritics((prev) => !prev)}
                  className="sr-only"
                />
                <div className="relative w-12 h-7">
                  <div
                    className={`absolute inset-0 rounded-full transition-colors duration-300 ${
                      hideDiacritics ? "bg-blue-500" : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  ></div>
                  <div
                    className={`absolute top-1 left-1 w-5 h-5 bg-white dark:bg-gray-900 rounded-full shadow transition-transform duration-300 ${
                      hideDiacritics ? "translate-x-5" : ""
                    }`}
                    style={{ transitionProperty: "transform, background-color" }}
                  ></div>
                </div>
                <span className="ms-3 text-base font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                  إخفاء الحركات
                </span>
              </label>
              {/* Toggle for Hide Translation */}
              <label className="inline-flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={hideEnglish}
                  onChange={() => setHideEnglish((prev) => !prev)}
                  className="sr-only"
                />
                <div className="relative w-12 h-7">
                  <div
                    className={`absolute inset-0 rounded-full transition-colors duration-300 ${
                      hideEnglish ? "bg-blue-500" : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  ></div>
                  <div
                    className={`absolute top-1 left-1 w-5 h-5 bg-white dark:bg-gray-900 rounded-full shadow transition-transform duration-300 ${
                      hideEnglish ? "translate-x-5" : ""
                    }`}
                    style={{ transitionProperty: "transform, background-color" }}
                  ></div>
                </div>
                <span className="ms-3 text-base font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                  إخفاء الترجمة
                </span>
              </label>
              {/* Toggle for Dark Mode */}
              <label className="inline-flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={() => setDarkMode((v) => !v)}
                  className="sr-only"
                />
                <div className="relative w-12 h-7">
                  <div
                    className={`absolute inset-0 rounded-full transition-colors duration-300 ${
                      darkMode ? "bg-blue-500" : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  ></div>
                  <div
                    className={`absolute top-1 left-1 w-5 h-5 bg-white dark:bg-gray-900 rounded-full shadow transition-transform duration-300 ${
                      darkMode ? "translate-x-5" : ""
                    }`}
                    style={{ transitionProperty: "transform, background-color" }}
                  ></div>
                </div>
                <span className="ms-3 text-base font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                  {darkMode ? (
                    <>
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="inline align-middle mr-1">
                        <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" fill="currentColor"/>
                      </svg>
                      الوضع النهاري
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="inline align-middle mr-1">
                        <circle cx="12" cy="12" r="5" fill="currentColor"/>
                        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      الوضع الليلي
                    </>
                  )}
                </span>
              </label>
            </div>
          )}
        </div>
      </div>

      {stories.map((story, storyIdx) => (
        <div key={storyIdx} className="mb-10 sm:mb-14">
          <h2 className={
            "text-2xl sm:text-3xl font-bold mb-5 sm:mb-8 tracking-tight " +
            (darkMode ? "text-blue-200" : "text-blue-800")
          }>
            {story.title}
          </h2>
          <div className="space-y-6 sm:space-y-8 w-full">
            {story.lines.map((line, lineIdx) => {
              const isSelectedLine =
                selectedWord &&
                selectedWord.storyIdx === storyIdx &&
                selectedWord.lineIdx === lineIdx;
              return (
                <React.Fragment key={lineIdx}>
                  <div
                    dir="rtl"
                    className="line flex flex-wrap justify-end gap-2 sm:gap-4 text-center"
                  >
                    {line.map((word, wordIdx) => {
                      const isSelected =
                        selectedWord &&
                        selectedWord.storyIdx === storyIdx &&
                        selectedWord.lineIdx === lineIdx &&
                        selectedWord.wordIdx === wordIdx;
                      return (
                        <div
                          key={wordIdx}
                          className={
                            "word flex flex-col items-center rounded-lg transition-all duration-200 " +
                            (isSelected
                              ? (darkMode
                                  ? "bg-blue-900/60 shadow-md ring-2 ring-blue-700"
                                  : "bg-blue-100/70 shadow-md ring-2 ring-blue-300")
                              : (darkMode
                                  ? "hover:bg-blue-900/40"
                                  : "hover:bg-blue-50/60")) +
                            " " +
                            (hideEnglish
                              ? "min-w-0 px-1 sm:px-2"
                              : "min-w-[3rem] sm:min-w-[4rem]")
                          }
                          style={{ cursor: "pointer" }}
                        >
                          <span
                            className={
                              "arabic leading-snug font-semibold transition-colors duration-200 " +
                              (hideEnglish ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl") +
                              (isSelected
                                ? (darkMode ? " text-blue-200" : " text-blue-700")
                                : (darkMode ? " text-gray-100" : " text-gray-900"))
                            }
                            data-base={word.base}
                            data-full={word.harakat}
                            onClick={() =>
                              setSelectedWord(
                                isSelected
                                  ? null
                                  : { storyIdx, lineIdx, wordIdx }
                              )
                            }
                          >
                            {hideDiacritics ? word.base : word.harakat}
                          </span>
                          {!hideEnglish && (
                            <span className={
                              "english text-xs sm:text-sm leading-snug mt-2 font-light " +
                              (darkMode ? "text-gray-300" : "text-gray-600")
                            }>
                              {word.english}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {/* Modern, clean, readable pane */}
                  {isSelectedLine && selectedWord && (
                    <div
                      className={
                        "w-full border rounded-2xl shadow-xl my-4 px-2 sm:px-8 py-8 animate-slide-down transition-colors duration-300 " +
                        (darkMode
                          ? "bg-gray-900/95 border-blue-900"
                          : "bg-white/95 border-blue-100")
                      }
                      style={{
                        transition: "max-height 0.3s cubic-bezier(0.4,0,0.2,1)",
                      }}
                    >
                      <div className="flex flex-col items-center">
                        {(() => {
                          const word = line[selectedWord.wordIdx];
                          if (!word) return null;
                          // Color code each part of the word at the top of the pane
                          return (
                            <div className="flex flex-col items-center w-full max-w-lg mx-auto">
                              <span className="arabic text-3xl sm:text-4xl font-extrabold mb-2 tracking-tight">
                                {word.metadata
                                  ? word.metadata.map((meta, i) => {
                                      const color = COLORS[meta.type] || COLORS.default;
                                      return (
                                        <span key={i} className={color}>
                                          {meta.word}
                                        </span>
                                      );
                                    })
                                  : (hideDiacritics ? word.base : word.harakat)}
                              </span>
                              <span className={
                                "english text-base sm:text-lg mb-4 font-medium " +
                                (darkMode ? "text-gray-200" : "text-gray-700")
                              }>
                                {word.english}
                              </span>
                              {word.metadata &&
                                word.metadata.map((meta, i) => {
                                  const color = COLORS[meta.type] || COLORS.default;
                                  return (
                                    <div
                                      key={i}
                                      className={
                                        "mb-5 w-full border rounded-lg px-4 py-3 shadow-sm transition-colors " +
                                        (darkMode
                                          ? "bg-blue-950/60 border-blue-900"
                                          : "bg-blue-50/60 border-blue-100")
                                      }
                                    >
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className={color + " font-bold text-xl"}>
                                          {meta.word}
                                        </span>
                                        <span className={
                                          "text-sm " +
                                          (darkMode ? "text-gray-400" : "text-gray-500")
                                        }>
                                          ({meta.type})
                                        </span>
                                      </div>
                                      <div className={
                                        "mb-2 text-base leading-relaxed font-normal border-b pb-2 " +
                                        (darkMode
                                          ? "text-gray-200 border-gray-700"
                                          : "text-gray-800 border-gray-200")
                                      }>
                                        {meta.definition}
                                      </div>
                                      {meta.type === "verb" && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mt-2">
                                          <div className="flex items-center justify-between">
                                            <span className={
                                              "font-semibold " +
                                              (darkMode ? "text-gray-300" : "text-gray-700")
                                            }>Root</span>
                                            <span dir="rtl" className="font-arabic text-base text-blue-700 dark:text-blue-300">{meta.root}</span>
                                          </div>
                                          <div className="flex items-center justify-between">
                                            <span className={
                                              "font-semibold " +
                                              (darkMode ? "text-gray-300" : "text-gray-700")
                                            }>Past</span>
                                            <span dir="rtl" className="font-arabic text-base text-blue-700 dark:text-blue-300">{meta.past}</span>
                                          </div>
                                          <div className="flex items-center justify-between">
                                            <span className={
                                              "font-semibold " +
                                              (darkMode ? "text-gray-300" : "text-gray-700")
                                            }>Future</span>
                                            <span dir="rtl" className="font-arabic text-base text-blue-700 dark:text-blue-300">{meta.future}</span>
                                          </div>
                                          <div className="flex items-center justify-between">
                                            <span className={
                                              "font-semibold " +
                                              (darkMode ? "text-gray-300" : "text-gray-700")
                                            }>Command</span>
                                            <span dir="rtl" className="font-arabic text-base text-blue-700 dark:text-blue-300">{meta.command}</span>
                                          </div>
                                          <div className="flex items-center justify-between">
                                            <span className={
                                              "font-semibold " +
                                              (darkMode ? "text-gray-300" : "text-gray-700")
                                            }>Active Participle</span>
                                            <span dir="rtl" className="font-arabic text-base text-blue-700 dark:text-blue-300">{meta.active_participle}</span>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;

