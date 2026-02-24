import React, { useState } from 'react';
import Navigation from './components/Navigation';
import BookViewer from './components/BookViewer';
import AIGuide from './components/AIGuide';
import { CHAPTERS, LANGUAGES } from './constants';
import { Language, Chapter } from './types';
import { Menu, Globe } from 'lucide-react';

const App: React.FC = () => {
  const [currentChapterId, setCurrentChapterId] = useState<string>(CHAPTERS[0].id);
  const [language, setLanguage] = useState<Language>('en');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const currentChapter = CHAPTERS.find(c => c.id === currentChapterId) || CHAPTERS[0];
  const currentLangOption = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  return (
    <div className="flex h-screen bg-stone-50 overflow-hidden">
      
      {/* Navigation (Sidebar) */}
      <Navigation 
        chapters={CHAPTERS}
        currentChapterId={currentChapterId}
        onSelectChapter={setCurrentChapterId}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        
        {/* Top Header (Mobile & Desktop utils) */}
        <header className="h-16 border-b border-stone-200 bg-white/80 backdrop-blur-sm sticky top-0 z-20 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 text-stone-600 hover:bg-stone-100 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-stone-800 font-semibold md:hidden truncate max-w-[200px]">
              {currentChapter.title}
            </h2>
          </div>

          <div className="flex items-center gap-4 relative">
            <div className="relative">
              <button 
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-stone-200 hover:bg-stone-50 hover:border-stone-300 transition-colors"
              >
                <Globe className="w-4 h-4 text-stone-500" />
                <span className="text-sm font-medium text-stone-700">{currentLangOption.flag} {currentLangOption.code.toUpperCase()}</span>
              </button>
              
              {isLangMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsLangMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-stone-100 py-1 z-20 animate-in fade-in slide-in-from-top-2">
                    {LANGUAGES.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm flex items-center gap-3 hover:bg-stone-50 ${language === lang.code ? 'text-amber-600 font-medium bg-stone-50' : 'text-stone-600'}`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Book Content */}
        <main className="flex-1 overflow-y-auto scroll-smooth">
          <BookViewer 
            chapter={currentChapter} 
            language={language}
          />
        </main>
        
        {/* AI Assistant Overlay */}
        <AIGuide language={language} />

      </div>
    </div>
  );
};

export default App;