import React from "react";

const Banner = ({ menuPaneOpen, setMenuPaneOpen, title }) => (
  <div className="fixed top-0 left-0 w-full z-50 bg-blue-700 dark:bg-blue-900 text-white text-center py-3 text-lg font-bold shadow-md select-none flex items-center justify-center">
    <span className="flex-1">{title}</span>
    <button
      className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent p-0 m-0 flex items-center justify-center"
      title={menuPaneOpen ? "إخفاء القائمة" : "إظهار القائمة"}
      onClick={() => setMenuPaneOpen((v) => !v)}
      style={{ transition: "background 0.3s" }}
    >
      {menuPaneOpen ? (
        // Chevron right icon (animated)
        <span
          style={{
            display: "inline-block",
            transition: "transform 0.25s cubic-bezier(.4,2,.6,1)",
            transform: "rotate(0deg)",
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M10 7l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      ) : (
        // Hamburger menu icon
        <span
          style={{
            display: "inline-block",
            transition: "transform 0.25s cubic-bezier(.4,2,.6,1)",
            transform: "none",
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <rect x="4" y="6" width="16" height="2" rx="1" fill="currentColor"/>
            <rect x="4" y="11" width="16" height="2" rx="1" fill="currentColor"/>
            <rect x="4" y="16" width="16" height="2" rx="1" fill="currentColor"/>
          </svg>
        </span>
      )}
    </button>
  </div>
);

export default Banner;
