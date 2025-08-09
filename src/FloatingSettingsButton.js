import React from "react";

const FloatingSettingsButton = ({
  showToggles,
  setShowToggles,
  hideTogglesAnim,
  setHideTogglesAnim,
  hideDiacritics,
  setHideDiacritics,
  hideEnglish,
  setHideEnglish,
  darkMode,
  setDarkMode,
}) => (
  <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
    {!showToggles && (
      <button
        className="mb-2 rounded-full bg-blue-700 dark:bg-blue-900 hover:bg-blue-800 dark:hover:bg-blue-800 text-white shadow-lg p-3 w-12 h-12 flex items-center justify-center transition-all"
        title="إظهار الإعدادات"
        onClick={() => setShowToggles(true)}
      >
        {/* Settings gear icon */}
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path
            d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.06-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.61-.22l-2.39.96a7.03 7.03 0 0 0-1.63-.94l-.36-2.53A.5.5 0 0 0 14 2h-4a.5.5 0 0 0-.5.42l-.36 2.53a7.03 7.03 0 0 0-1.63.94l-2.39-.96a.5.5 0 0 0-.61.22l-1.92 3.32a.5.5 0 0 0 .12.64l2.03 1.58c-.04.3-.06.61-.06.94s.02.64.06.94l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32a.5.5 0 0 0 .61.22l2.39-.96c.5.38 1.04.7 1.63.94l.36 2.53A.5.5 0 0 0 10 22h4a.5.5 0 0 0 .5-.42l.36-2.53a7.03 7.03 0 0 0 1.63-.94l2.39.96a.5.5 0 0 0 .61-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58zM12 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"
            fill="currentColor"
          />
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
);

export default FloatingSettingsButton;
