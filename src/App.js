import React, { useEffect, useState } from "react";

// Helper to get all story files in the content folder (recursively)
function importAll(r) {
  return r.keys().map((key) => ({
    path: key.replace("./", ""), // e.g. "folder/file.json"
    content: r(key),
  }));
}

// Recursively import all JSON files in ./content and subfolders
const storyFiles = importAll(
  require.context("./content", true, /\.json$/)
);

// Helper to build a tree from flat file list
function buildTree(files) {
  const root = {};
  files.forEach(({ path, content }) => {
    const parts = path.split("/");
    let node = root;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (i === parts.length - 1) {
        // File node
        node[part] = { __file: true, content, path };
      } else {
        node[part] = node[part] || {};
        node = node[part];
      }
    }
  });
  return root;
}

const tree = buildTree(storyFiles);

const COLORS = {
  particle: "text-green-500 dark:text-green-400",
  verb: "text-blue-500 dark:text-blue-400",
  noun: "text-purple-600 dark:text-purple-400",
  pronoun: "text-pink-500 dark:text-pink-400",
  default: "text-gray-800 dark:text-gray-100",
};

// Recursive menu component with collapsible folders
function StoryMenu({ tree, selectedPath, setSelectedFile, level = 0, openFolders, setOpenFolders, parentPath = "" }) {
  return (
    <ul className={level === 0 ? "flex flex-col gap-1" : "pl-4 border-r border-blue-100 dark:border-blue-900"}>
      {Object.entries(tree).map(([key, value]) => {
        if (value && value.__file) {
          // File node
          const title = value.content.stories?.[0]?.title || key.replace(/\.json$/, "");
          return (
            <li key={value.path}>
              <button
                className={
                  "w-full text-right px-3 py-2 rounded-lg transition-all font-medium " +
                  (selectedPath === value.path
                    ? "bg-blue-500 text-white dark:bg-blue-700"
                    : "hover:bg-blue-100 dark:hover:bg-blue-800 text-blue-900 dark:text-blue-100")
                }
                onClick={() => setSelectedFile(value.path)}
              >
                {title}
              </button>
            </li>
          );
        } else {
          // Folder node
          const folderPath = parentPath ? `${parentPath}/${key}` : key;
          const isOpen = openFolders[folderPath] ?? true;
          return (
            <li key={key} className="mb-1">
              <button
                className="flex items-center gap-2 font-bold text-blue-700 dark:text-blue-200 mb-1 mt-2 w-full text-right focus:outline-none"
                onClick={() =>
                  setOpenFolders((prev) => ({
                    ...prev,
                    [folderPath]: !isOpen,
                  }))
                }
                tabIndex={0}
                aria-expanded={isOpen}
              >
                <span className="inline-block transition-transform duration-200"
                  style={{
                    transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <path d="M7 7l3 3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <span>{key}</span>
              </button>
              {isOpen && (
                <StoryMenu
                  tree={value}
                  selectedPath={selectedPath}
                  setSelectedFile={setSelectedFile}
                  level={level + 1}
                  openFolders={openFolders}
                  setOpenFolders={setOpenFolders}
                  parentPath={folderPath}
                />
              )}
            </li>
          );
        }
      })}
    </ul>
  );
}

const App = () => {
  const [stories, setStories] = useState([]);
  const [storyTitle, setStoryTitle] = useState("");
  // Use path for selectedFile (e.g. "folder/file.json")
  const allPaths = storyFiles.map(f => f.path);
  const [selectedFile, setSelectedFile] = useState(allPaths[0] || "");
  const [openFolders, setOpenFolders] = useState({});
  const [hideDiacritics, setHideDiacritics] = useState(false);
  const [hideEnglish, setHideEnglish] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null);
  const [showToggles, setShowToggles] = useState(true);
  const [hideTogglesAnim, setHideTogglesAnim] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(true);
  const [menuPaneOpen, setMenuPaneOpen] = useState(true);

  // Load stories when selectedFile changes
  useEffect(() => {
    const file = storyFiles.find((f) => f.path === selectedFile);
    if (file) {
      setStories(file.content.stories || []);
      setStoryTitle(file.content.stories?.[0]?.title || "");
      setSelectedWord(null);
    }
  }, [selectedFile]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className={
      "flex min-h-screen transition-colors duration-300 " +
      (darkMode
        ? "bg-gradient-to-br from-gray-900 via-blue-950 to-gray-800 text-gray-100"
        : "bg-gradient-to-br from-white via-blue-50 to-blue-100 text-gray-900")
    }>
      {/* Toggle button for menu pane */}
      {!menuPaneOpen && (
        <button
          className="fixed top-4 left-2 z-50 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg p-2 transition-all"
          title="إظهار القائمة"
          onClick={() => setMenuPaneOpen(true)}
        >
          {/* Expand icon (chevron right) */}
          <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
            <path d="M7 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
      {/* Collapsible left menu for story selection */}
      <aside className={
        "relative transition-all duration-300 z-40 " +
        (menuPaneOpen
          ? "w-56 min-w-[12rem] max-w-xs"
          : "w-0 min-w-0 max-w-0 overflow-hidden")
      }>
        {menuPaneOpen && (
          <>
            <button
              className="absolute top-4 left-0 z-50 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg p-2 transition-all ml-56"
              style={{ transition: "margin 0.3s" }}
              title="إخفاء القائمة"
              onClick={() => setMenuPaneOpen(false)}
            >
              {/* Collapse icon (chevron left) */}
              <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
                <path d="M13 15l-5-5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className={
              "h-full bg-white/90 dark:bg-gray-900/90 border-r border-gray-200 dark:border-gray-800 py-8 px-4 flex flex-col gap-2 shadow-lg transition-all duration-300 " +
              (menuPaneOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")
            }>
              <h2 className="text-lg font-bold mb-4 text-blue-700 dark:text-blue-200">القصص</h2>
              <StoryMenu
                tree={tree}
                selectedPath={selectedFile}
                setSelectedFile={setSelectedFile}
                openFolders={openFolders}
                setOpenFolders={setOpenFolders}
              />
            </div>
          </>
        )}
      </aside>
      {/* Main content */}
      <div className="flex-1">
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
        <div className="text-right px-2 sm:px-8 py-4 sm:py-8 font-[Amiri] w-full max-w-none">
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
      </div>
    </div>
  );
};

export default App;

