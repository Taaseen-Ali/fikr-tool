import React from "react";

// Recursive menu component with collapsible folders
function StoryMenu({ tree, selectedPath, setSelectedFile, level = 0, openFolders, setOpenFolders, parentPath = "" }) {
  return (
    <ul className={level === 0 ? "flex flex-col gap-1" : `pl-${level * 4}`}>
      {Object.entries(tree).map(([key, value]) => {
        if (value && value.__file) {
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

const MenuPane = ({
  menuPaneOpen,
  tree,
  selectedFile,
  setSelectedFile,
  openFolders,
  setOpenFolders,
}) => (
  <aside
    className={
      "fixed top-0 right-0 h-full z-40 transition-transform duration-300 ease-in-out " +
      (menuPaneOpen
        ? "translate-x-0"
        : "translate-x-full pointer-events-none") +
      " w-56 min-w-[12rem] max-w-xs"
    }
    style={{
      boxShadow: menuPaneOpen ? "rgba(0,0,0,0.08) 0px 2px 16px" : "none",
    }}
  >
    <div
      className={
        "h-full bg-white/90 dark:bg-gray-900/90 border-l border-gray-200 dark:border-gray-800 py-8 px-4 flex flex-col gap-2 shadow-lg transition-all duration-300 " +
        (menuPaneOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")
      }
      style={{
        height: "100%",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <h2 className="text-lg font-bold mb-4 text-blue-700 dark:text-blue-200 mt-14">الدليل</h2>
      <StoryMenu
        tree={tree}
        selectedPath={selectedFile}
        setSelectedFile={setSelectedFile}
        openFolders={openFolders}
        setOpenFolders={setOpenFolders}
      />
    </div>
  </aside>
);

export default MenuPane;
