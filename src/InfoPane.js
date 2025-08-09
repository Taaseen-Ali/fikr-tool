import React from "react";

const InfoPane = ({
  stories,
  darkMode,
  hideDiacritics,
  hideEnglish,
  selectedWord,
  setSelectedWord,
  COLORS,
}) => (
  <React.Fragment>
    {stories.map((story, storyIdx) => (
      <div
        key={storyIdx}
        className="mb-10 sm:mb-14"
        // Add scroll margin to prevent banner overlap when jumping to anchor or scrolling
        style={{ scrollMarginTop: "6rem" }}
      >
        <h2
          className={
            "text-2xl sm:text-3xl font-bold mb-5 sm:mb-8 tracking-tight " +
            (darkMode ? "text-blue-200" : "text-blue-800")
          }
          // Add extra top padding to the title itself
          style={{ paddingTop: "2.5rem" }}
        >
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
                {/* Info pane */}
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
                                        {/* Add Masdar after Future */}
                                        <div className="flex items-center justify-between">
                                          <span className={
                                            "font-semibold " +
                                            (darkMode ? "text-gray-300" : "text-gray-700")
                                          }>Masdar</span>
                                          <span dir="rtl" className="font-arabic text-base text-blue-700 dark:text-blue-300">{meta.masdar}</span>
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
  </React.Fragment>
);

export default InfoPane;
