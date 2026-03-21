import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import rootsData from './roots_data.json';

// ─── Sarf Table ─────────────────────────────────────────────────────────────

const SarfTable = ({ section, darkMode }) => {
  const rows = section.rows || [];
  return (
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className={darkMode ? 'bg-gray-800' : 'bg-blue-50'}>
          <th className={`px-3 py-2 text-right font-arabic text-base font-semibold border-b ${darkMode ? 'border-gray-700 text-blue-300' : 'border-blue-100 text-blue-700'}`} colSpan={3}>
            {section.label}
          </th>
        </tr>
        <tr className={`text-xs ${darkMode ? 'bg-gray-800/50 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
          <th className={`px-3 py-1 text-right font-medium border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>الضمير</th>
          <th className={`px-2 py-1 text-center font-medium border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>العدد</th>
          <th className={`px-3 py-1 text-right font-arabic font-medium border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>الصيغة</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr
            key={i}
            className={[
              i % 2 === 0
                ? (darkMode ? 'bg-gray-900' : 'bg-white')
                : (darkMode ? 'bg-gray-800/30' : 'bg-gray-50/60'),
              'transition-colors',
            ].join(' ')}
          >
            <td className={`px-3 py-2 font-arabic text-right ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {row.person}
            </td>
            <td className={`px-2 py-2 text-center text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              {row.num === 'sg' ? 'مفرد' : row.num === 'du' ? 'مثنى' : 'جمع'}
            </td>
            <td className={`px-3 py-2 font-arabic text-right text-lg font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
              {row.form}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// ─── Sarf Kabir Panel ────────────────────────────────────────────────────────

const SECTION_KEYS = ['madi', 'mudari_marfu', 'mudari_mansub', 'mudari_majzum', 'amr', 'nahy'];

const tabLabels = {
  madi: 'الماضي',
  mudari_marfu: 'مرفوع',
  mudari_mansub: 'منصوب',
  mudari_majzum: 'مجزوم',
  amr: 'الأمر',
  nahy: 'النهي',
};

const SarfKabirPanel = ({ sarf_kabir, darkMode }) => {
  const [activeTab, setActiveTab] = useState('madi');
  const sk = sarf_kabir || {};

  if (!sarf_kabir) {
    return (
      <div className={`rounded-2xl border p-8 text-center ${darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
        <p className={`font-arabic text-2xl mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>قريباً</p>
        <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Conjugation data for this form is not yet available.</p>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border overflow-hidden ${darkMode ? 'border-gray-700' : 'border-blue-100'}`}>
      {/* Tabs */}
      <div className={`flex overflow-x-auto border-b ${darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-100 bg-white'}`}>
        {SECTION_KEYS.map(key =>
          sk[key] ? (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={[
                'px-4 py-2.5 text-sm font-arabic whitespace-nowrap transition-colors border-b-2 -mb-px',
                activeTab === key
                  ? (darkMode ? 'border-blue-400 text-blue-300 bg-gray-800' : 'border-blue-500 text-blue-600 bg-blue-50/50')
                  : (darkMode ? 'border-transparent text-gray-400 hover:text-gray-200' : 'border-transparent text-gray-500 hover:text-gray-700'),
              ].join(' ')}
            >
              {tabLabels[key] || key}
            </button>
          ) : null
        )}
      </div>
      <div className={darkMode ? 'bg-gray-900' : 'bg-white'}>
        {sk[activeTab] && <SarfTable section={sk[activeTab]} darkMode={darkMode} />}
      </div>
    </div>
  );
};

// ─── Root Page ────────────────────────────────────────────────────────────────

export default function RootPage({ darkMode }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const rootData = rootsData[slug];

  // Build unified list of selectable babs from rootData.babs.
  // Each bab now carries form_type ("mujarrad" | "mazeed") and form_number (1–10).
  const allBabs = React.useMemo(() => {
    if (!rootData) return [];

    return (rootData.babs || []).map((bab, i) => ({
      id: `bab-${i}`,
      label: bab.name || 'الباب',
      wazn_madi: bab.wazn_madi,
      wazn_mudari: bab.wazn_mudari,
      masdar: bab.masdar || null,
      masdar_meaning: bab.masdar_meaning || null,
      sarf_kabir: bab.sarf_kabir,
      type: bab.form_type || 'mujarrad',
      form_number: bab.form_number || null,
    }));
  }, [rootData]);

  const [selectedBabId, setSelectedBabId] = useState(null);
  const selectedBab = allBabs.find(b => b.id === selectedBabId) || allBabs[0];

  if (!rootData) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
        <header className={`fixed top-0 left-0 right-0 z-20 h-14 flex items-center px-4 gap-3 border-b backdrop-blur-md ${darkMode ? 'bg-gray-900/90 border-gray-700' : 'bg-white/90 border-gray-200'}`}>
          <button onClick={() => navigate(-1)} className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          </button>
          <h1 className={`font-arabic text-xl font-bold ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>{slug}</h1>
        </header>
        <main className="pt-20 pb-16 px-4 text-center">
          <div className={`py-20 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <p className="font-arabic text-4xl mb-4">؟</p>
            <p className="text-lg font-semibold mb-2">Root data not yet available</p>
            <p className="text-sm">Data for <code className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">{slug}</code> is still being generated.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={[
        'fixed top-0 left-0 right-0 z-20 h-14 flex items-center px-4 gap-3',
        'border-b backdrop-blur-md',
        darkMode ? 'bg-gray-900/90 border-gray-700' : 'bg-white/90 border-gray-200',
      ].join(' ')}>
        <button
          onClick={() => navigate(-1)}
          className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </button>
        <h1 className={`font-arabic text-xl font-bold ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
          {rootData.root}
        </h1>
        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          — {rootData.meaning}
        </span>
      </header>

      <main className="pt-20 pb-16 px-4 sm:px-8 max-w-3xl mx-auto">

        {/* Root header card */}
        <div className={`rounded-2xl border p-6 mb-6 text-center ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-blue-100 shadow-sm'}`}>
          <p className={`font-arabic text-5xl font-bold mb-2 tracking-widest ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
            {rootData.root}
          </p>
          <p className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {rootData.meaning}
          </p>
        </div>

        {/* Bab selector dropdown */}
        {allBabs.length > 0 && (
          <div className="mb-6">
            <label className={`block text-xs uppercase tracking-wide mb-2 font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Select Bab
            </label>
            <div className={`rounded-xl border overflow-hidden ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              {allBabs.map((bab) => (
                <button
                  key={bab.id}
                  onClick={() => setSelectedBabId(bab.id)}
                  className={[
                    'w-full text-right px-4 py-3 flex items-center justify-between gap-3 transition-colors border-b last:border-b-0',
                    darkMode ? 'border-gray-700' : 'border-gray-100',
                    (selectedBab?.id === bab.id)
                      ? (darkMode ? 'bg-blue-900/40' : 'bg-blue-50')
                      : (darkMode ? 'bg-gray-900 hover:bg-gray-800' : 'bg-white hover:bg-gray-50'),
                  ].join(' ')}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                      bab.type === 'mujarrad'
                        ? (darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600')
                        : (darkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-600')
                    }`}>
                      {bab.type === 'mujarrad' ? 'مجرد' : 'مزيد'}
                    </span>
                    <span className={`text-sm truncate ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {bab.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0" dir="rtl">
                    {bab.masdar && (
                      <span className={`font-arabic text-sm font-semibold ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                        {bab.masdar}
                      </span>
                    )}
                    <span className={`font-arabic text-base font-bold ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                      {bab.wazn_madi}{bab.wazn_mudari ? ` / ${bab.wazn_mudari}` : ''}
                    </span>
                    {selectedBab?.id === bab.id && (
                      <svg className={`w-4 h-4 shrink-0 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Selected bab detail */}
        {selectedBab && (
          <div>
            {/* Bab info bar */}
            <div className={`rounded-2xl border p-4 mb-4 ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-blue-100 shadow-sm'}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className={`font-arabic text-2xl font-bold ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                    {selectedBab.wazn_madi}{selectedBab.wazn_mudari ? ` / ${selectedBab.wazn_mudari}` : ''}
                  </p>
                  <p className={`text-sm mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{selectedBab.label}</p>
                  {selectedBab.note && (
                    <p className={`text-xs mt-1 italic ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{selectedBab.note}</p>
                  )}
                </div>
                {selectedBab.masdar && (
                  <div className="text-right">
                    <p className={`font-arabic text-xl font-bold ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>{selectedBab.masdar}</p>
                    {selectedBab.masdar_meaning && (
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{selectedBab.masdar_meaning}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Sarf Kabir */}
            <h2 className={`font-arabic text-lg font-bold mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              الصرف الكبير
            </h2>
            <SarfKabirPanel sarf_kabir={selectedBab.sarf_kabir} darkMode={darkMode} />
          </div>
        )}



      </main>
    </div>
  );
}
