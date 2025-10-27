import React, { useEffect, useState } from "react";
import Banner from "./Banner";
import MenuPane from "./MenuPane";
import FloatingSettingsButton from "./FloatingSettingsButton";
import InfoPane from "./InfoPane";

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
  const tree = {};
  files.forEach((f) => {
    const parts = f.path.split("/");
    let node = tree;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (i === parts.length - 1) {
        node[part] = { __file: true, path: f.path, content: f.content };
      } else {
        if (!node[part]) node[part] = {};
        node = node[part];
      }
    }
  });
  return sortTree(tree);
}

function sortTree(tree) {
  const sorted = {};
  const entries = Object.entries(tree);
  
  // Sort entries: files by numeric prefix, folders alphabetically
  entries.sort((a, b) => {
    const [keyA, valueA] = a;
    const [keyB, valueB] = b;
    
    const isFileA = valueA?.__file;
    const isFileB = valueB?.__file;
    
    // If both are files, sort by numeric prefix
    if (isFileA && isFileB) {
      const numA = parseInt(keyA.match(/^(\d+)/)?.[1] || "0");
      const numB = parseInt(keyB.match(/^(\d+)/)?.[1] || "0");
      return numA - numB;
    }
    
    // Files come after folders
    if (isFileA !== isFileB) {
      return isFileA ? 1 : -1;
    }
    
    // Both are folders, sort alphabetically
    return keyA.localeCompare(keyB, 'ar');
  });
  
  entries.forEach(([key, value]) => {
    if (value?.__file) {
      sorted[key] = value;
    } else {
      sorted[key] = sortTree(value);
    }
  });
  
  return sorted;
}

const tree = buildTree(storyFiles);

const COLORS = {
  particle: "text-green-500 dark:text-green-400",
  verb: "text-blue-500 dark:text-blue-400",
  noun: "text-purple-600 dark:text-purple-400",
  pronoun: "text-pink-500 dark:text-pink-400",
  default: "text-gray-800 dark:text-gray-100",
};

const APP_TITLE_AR = "مترجم لطلاب العلم";

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

  // Set browser tab title
  useEffect(() => {
    document.title = APP_TITLE_AR;
  }, []);

  // Handler to close menu when clicking outside
  function handleMainClick(e) {
    // Only close if menu is open and click is not on the banner or menu
    if (menuPaneOpen) {
      // Check if click is inside the menu or banner
      const menu = document.querySelector("aside");
      const banner = document.querySelector(".fixed.top-0.left-0.w-full");
      if (
        menu &&
        (menu.contains(e.target) ||
         (banner && banner.contains(e.target)))
      ) {
        return;
      }
      setMenuPaneOpen(false);
    }
  }

  return (
    <div
      className={
        "flex min-h-screen transition-colors duration-300 " +
        (darkMode
          ? "bg-gradient-to-br from-gray-900 via-blue-950 to-gray-800 text-gray-100"
          : "bg-gradient-to-br from-white via-blue-50 to-blue-100 text-gray-900")
      }
      onClick={handleMainClick}
    >
      <Banner
        menuPaneOpen={menuPaneOpen}
        setMenuPaneOpen={setMenuPaneOpen}
        title={APP_TITLE_AR}
      />
      <MenuPane
        menuPaneOpen={menuPaneOpen}
        tree={tree}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        openFolders={openFolders}
        setOpenFolders={setOpenFolders}
      />
      <div className="flex-1">
        <FloatingSettingsButton
          showToggles={showToggles}
          setShowToggles={setShowToggles}
          hideTogglesAnim={hideTogglesAnim}
          setHideTogglesAnim={setHideTogglesAnim}
          hideDiacritics={hideDiacritics}
          setHideDiacritics={setHideDiacritics}
          hideEnglish={hideEnglish}
          setHideEnglish={setHideEnglish}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
        {/* Increase pt-16 to pt-24 for more space below the banner */}
        <div className="text-right px-2 sm:px-8 py-4 sm:py-8 font-[Amiri] w-full max-w-none pt-24">
          <InfoPane
            stories={stories}
            darkMode={darkMode}
            hideDiacritics={hideDiacritics}
            hideEnglish={hideEnglish}
            selectedWord={selectedWord}
            setSelectedWord={setSelectedWord}
            COLORS={COLORS}
          />
        </div>
      </div>
    </div>
  );
};

export default App;