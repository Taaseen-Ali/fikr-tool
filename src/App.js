import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import storiesData from './stories_data.json';
import RootPage from './RootPage';
import { rootToSlug } from './utils/rootSlug';

// ─── helpers ───────────────────────────────────────────────────────────────

function removeDiacritics(text) {
  return text ? text.replace(/[\u064B-\u065F\u0610-\u061A\u06D6-\u06ED]/g, '') : '';
}

function buildSections(data) {
  // group by folder > subfolder
  const sections = {};
  data.forEach((item) => {
    const folder = item.folder;
    const sub = item.subfolder || '__root__';
    if (!sections[folder]) sections[folder] = {};
    if (!sections[folder][sub]) sections[folder][sub] = [];
    sections[folder][sub].push(item);
  });
  return sections;
}

const WORD_COLORS = {
  particle: 'text-emerald-500 dark:text-emerald-400',
  verb:     'text-blue-500   dark:text-blue-400',
  noun:     'text-purple-500 dark:text-purple-400',
  pronoun:  'text-rose-500   dark:text-rose-400',
};

// ─── Word card ─────────────────────────────────────────────────────────────

const WordCard = ({ word, isSelected, onClick, hideDiacritics, hideEnglish, darkMode }) => {
  const arabic = hideDiacritics ? word.base : word.harakat;
  return (
    <button
      onClick={onClick}
      className={[
        'flex flex-col items-center rounded-xl px-2 py-1 transition-all duration-150 cursor-pointer select-none focus:outline-none',
        isSelected
          ? (darkMode ? 'bg-blue-800/60 ring-2 ring-blue-500' : 'bg-blue-100 ring-2 ring-blue-400')
          : (darkMode ? 'hover:bg-white/5' : 'hover:bg-blue-50'),
      ].join(' ')}
    >
      <span className={[
        'font-arabic leading-snug font-semibold',
        hideEnglish ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl',
        darkMode ? 'text-gray-100' : 'text-gray-900',
      ].join(' ')}>
        {arabic}
      </span>
      {!hideEnglish && (
        <span className={[
          'text-xs mt-1 font-light',
          darkMode ? 'text-gray-400' : 'text-gray-500',
        ].join(' ')}>
          {word.english}
        </span>
      )}
    </button>
  );
};

// ─── Info Panel ────────────────────────────────────────────────────────────

const InfoPanel = ({ word, darkMode, hideDiacritics }) => {
  const navigate = useNavigate();
  if (!word) return null;
  const arabic = hideDiacritics ? word.base : word.harakat;

  return (
    <div className={[
      'animate-slide-down rounded-2xl border shadow-xl my-3 p-5',
      darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-blue-100',
    ].join(' ')}>
      <div className="flex flex-col items-center gap-1 mb-4">
        <span className={[
          'font-arabic text-4xl font-bold',
          darkMode ? 'text-gray-100' : 'text-gray-900',
        ].join(' ')}>
          {word.metadata
            ? word.metadata.map((m, i) => (
                <span key={i} className={WORD_COLORS[m.type] || ''}>
                  {m.word}
                </span>
              ))
            : arabic}
        </span>
        <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{word.english}</span>
      </div>

      {word.metadata && word.metadata.map((meta, i) => (
        <div
          key={i}
          className={[
            'rounded-xl border p-4 mb-3',
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-blue-50/70 border-blue-100',
          ].join(' ')}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className={`font-arabic text-xl font-bold ${WORD_COLORS[meta.type] || ''}`}>{meta.word}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium uppercase tracking-wide ${
              meta.type === 'verb'    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
              meta.type === 'noun'   ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' :
              meta.type === 'particle' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' :
              'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300'
            }`}>{meta.type}</span>
          </div>

          <p className={[
            'text-sm mb-3 leading-relaxed',
            darkMode ? 'text-gray-300' : 'text-gray-700',
          ].join(' ')}>{meta.definition}</p>

          {meta.type === 'verb' && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              {[
                ['Root', meta.root],
                ['Past', meta.past],
                ['Future', meta.future],
                ['Masdar', meta.masdar],
                ['Command', meta.command],
                ['Active Participle', meta.active_participle],
              ].map(([label, val]) => val && (
                <div key={label} className="flex justify-between items-center">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>{label}</span>
                  {label === 'Root' ? (
                    <button
                      onClick={() => navigate(`/root/${rootToSlug(val)}`)}
                      className={`font-arabic font-semibold underline decoration-dotted underline-offset-2 transition-colors ${
                        darkMode
                          ? 'text-blue-300 hover:text-blue-200'
                          : 'text-blue-700 hover:text-blue-900'
                      }`}
                      dir="rtl"
                    >
                      {val}
                    </button>
                  ) : (
                    <span dir="rtl" className={`font-arabic font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>{val}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// ─── Sidebar ───────────────────────────────────────────────────────────────

const Sidebar = ({ sections, selectedItem, setSelectedItem, isOpen, darkMode, onClose }) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={[
        'fixed top-0 right-0 h-full z-40 w-64 flex flex-col transition-transform duration-300',
        isOpen ? 'translate-x-0' : 'translate-x-full',
        darkMode ? 'bg-gray-900 border-l border-gray-700' : 'bg-white border-l border-gray-200',
        'shadow-2xl',
      ].join(' ')}>
        <div className={[
          'flex items-center justify-between px-4 py-4 border-b',
          darkMode ? 'border-gray-700' : 'border-gray-200',
        ].join(' ')}>
          <h2 className={`text-lg font-bold font-arabic ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
            الدليل
          </h2>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {Object.entries(sections).map(([folder, subs]) => (
            <div key={folder} className="mb-4">
              <p className={`text-xs font-semibold uppercase tracking-wider mb-2 px-2 font-arabic ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {folder}
              </p>
              {Object.entries(subs).map(([sub, items]) => (
                <div key={sub} className="mb-2">
                  {sub !== '__root__' && (
                    <p className={`text-sm font-medium px-2 py-1 mb-1 font-arabic ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                      {sub.trim()}
                    </p>
                  )}
                  {items.map((item) => {
                    const title = item.stories?.[0]?.title || item.path;
                    const isActive = selectedItem?.path === item.path;
                    return (
                      <button
                        key={item.path}
                        onClick={() => { setSelectedItem(item); onClose(); }}
                        className={[
                          'w-full text-right px-3 py-2 rounded-lg text-sm font-arabic mb-0.5 transition-colors',
                          isActive
                            ? (darkMode ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white')
                            : (darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-blue-50 text-gray-700'),
                        ].join(' ')}
                      >
                        {title}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          ))}
        </div>
      </aside>
    </>
  );
};

// ─── Settings Panel ────────────────────────────────────────────────────────

const SettingsPanel = ({ isOpen, darkMode, setDarkMode, hideDiacritics, setHideDiacritics, hideEnglish, setHideEnglish }) => {
  if (!isOpen) return null;
  const Toggle = ({ label, value, onChange }) => (
    <label className="flex items-center justify-between gap-4 cursor-pointer">
      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{label}</span>
      <button
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        dir="ltr"
        className={[
          'w-10 h-6 rounded-full transition-colors relative',
          value ? 'bg-blue-500' : (darkMode ? 'bg-gray-600' : 'bg-gray-300'),
        ].join(' ')}
      >
        <span className={[
          'absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all',
          value ? 'left-5' : 'left-1',
        ].join(' ')} />
      </button>
    </label>
  );

  return (
    <div className={[
      'absolute top-10 left-0 w-56 rounded-2xl border shadow-xl p-4 flex flex-col gap-3 z-50',
      darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200',
    ].join(' ')}>
      <Toggle label="Dark mode"          value={darkMode}         onChange={setDarkMode} />
      <Toggle label="Hide diacritics"    value={hideDiacritics}   onChange={setHideDiacritics} />
      <Toggle label="Hide translations"  value={hideEnglish}      onChange={setHideEnglish} />
    </div>
  );
};

// ─── Main App ──────────────────────────────────────────────────────────────

function MainApp({ darkModeOverride, setDarkModeOverride }) {
  const sections = buildSections(storiesData);
  const firstItem = storiesData[0] || null;

  const [selectedItem, setSelectedItem] = useState(firstItem);
  const [selectedWord, setSelectedWord] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const darkMode = darkModeOverride;
  const setDarkMode = setDarkModeOverride;
  const [hideDiacritics, setHideDiacritics] = useState(false);
  const [hideEnglish, setHideEnglish] = useState(false);
  const settingsRef = useRef(null);

  useEffect(() => {
    setSelectedWord(null);
  }, [selectedItem]);

  useEffect(() => {
    const handler = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const stories = selectedItem?.stories || [];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={[
        'fixed top-0 left-0 right-0 z-20 h-14 flex items-center justify-between px-4',
        'border-b backdrop-blur-md',
        darkMode ? 'bg-gray-900/90 border-gray-700' : 'bg-white/90 border-gray-200',
      ].join(' ')}>
        <div className="flex items-center gap-3">
          {/* Settings */}
          <div className="relative" ref={settingsRef}>
            <button
              onClick={() => setSettingsOpen(v => !v)}
              className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
              title="Settings"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
              </svg>
            </button>
            <SettingsPanel
              isOpen={settingsOpen}
              darkMode={darkMode} setDarkMode={setDarkMode}
              hideDiacritics={hideDiacritics} setHideDiacritics={setHideDiacritics}
              hideEnglish={hideEnglish} setHideEnglish={setHideEnglish}
            />
          </div>
        </div>

        <h1 className={`font-arabic text-xl font-bold ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
          مترجم لطلاب العلم
        </h1>

        {/* Sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(v => !v)}
          className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
          title="Menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      </header>

      {/* Sidebar */}
      <Sidebar
        sections={sections}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        isOpen={sidebarOpen}
        darkMode={darkMode}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Content */}
      <main className="pt-20 pb-16 px-4 sm:px-8 max-w-3xl mx-auto">
        {stories.map((story, si) => (
          <section key={si} className="mb-14">
            <h2 className={`font-arabic text-2xl sm:text-3xl font-bold mb-8 text-center ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
              {story.title}
            </h2>

            <div className="space-y-6">
              {story.lines.map((line, li) => {
                const isSelectedLine = selectedWord?.si === si && selectedWord?.li === li;
                return (
                  <React.Fragment key={li}>
                    <div dir="rtl" className="flex flex-wrap justify-end gap-1 sm:gap-3">
                      {line.map((word, wi) => (
                        <WordCard
                          key={wi}
                          word={word}
                          isSelected={selectedWord?.si === si && selectedWord?.li === li && selectedWord?.wi === wi}
                          onClick={() => setSelectedWord(
                            selectedWord?.si === si && selectedWord?.li === li && selectedWord?.wi === wi
                              ? null
                              : { si, li, wi }
                          )}
                          hideDiacritics={hideDiacritics}
                          hideEnglish={hideEnglish}
                          darkMode={darkMode}
                        />
                      ))}
                    </div>
                    {isSelectedLine && selectedWord && (
                      <InfoPanel
                        word={line[selectedWord.wi]}
                        darkMode={darkMode}
                        hideDiacritics={hideDiacritics}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainApp darkModeOverride={darkMode} setDarkModeOverride={setDarkMode} />} />
        <Route path="/root/:slug" element={<RootPage darkMode={darkMode} />} />
      </Routes>
    </BrowserRouter>
  );
}
