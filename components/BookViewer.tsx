import React, { useState, useEffect } from 'react';
import { Chapter, Language } from '../types';
import { translateContent } from '../services/geminiService';
import { Loader2, Languages } from 'lucide-react';

interface BookViewerProps {
  chapter: Chapter;
  language: Language;
}

const BookViewer: React.FC<BookViewerProps> = ({ chapter, language }) => {
  const [displayedContent, setDisplayedContent] = useState<string>(chapter.content);
  const [displayedTitle, setDisplayedTitle] = useState<string>(chapter.title);
  const [isTranslating, setIsTranslating] = useState(false);

  // Effect to handle translation when chapter or language changes
  useEffect(() => {
    const updateContent = async () => {
      if (language === 'en') {
        setDisplayedContent(chapter.content);
        setDisplayedTitle(chapter.title);
        return;
      }

      setIsTranslating(true);
      try {
        const [translatedTitle, translatedBody] = await Promise.all([
          translateContent(chapter.title, language),
          translateContent(chapter.content, language)
        ]);
        setDisplayedTitle(translatedTitle);
        setDisplayedContent(translatedBody);
      } catch (e) {
        console.error("Failed to translate view", e);
      } finally {
        setIsTranslating(false);
      }
    };

    updateContent();
  }, [chapter.id, language]); // Re-run when chapter changes or language changes

  // Simple parser to render markdown-like content safely
  const renderContent = (text: string) => {
    return text.split('\n').map((line, idx) => {
      if (line.startsWith('# ')) {
        return <h1 key={idx} className="text-4xl md:text-5xl font-bold serif text-stone-900 mb-6 mt-8">{line.replace('# ', '')}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={idx} className="text-2xl md:text-3xl font-semibold serif text-stone-800 mb-4 mt-8 pb-2 border-b border-stone-200">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('* ')) {
        return (
          <li key={idx} className="ml-6 list-disc text-stone-700 mb-2 pl-2 marker:text-amber-600">
            {parseInline(line.replace('* ', ''))}
          </li>
        );
      }
      if (line.startsWith('> ')) {
        return (
          <blockquote key={idx} className="border-l-4 border-amber-500 pl-6 italic text-xl text-stone-600 my-8 py-2 bg-stone-50 rounded-r-lg">
            "{parseInline(line.replace('> ', ''))}"
          </blockquote>
        );
      }
      if (line.trim().match(/^\d+\./)) {
         return (
             <div key={idx} className="ml-6 mb-2 text-stone-700 flex gap-2">
                 <span className="font-bold text-amber-700 font-mono">{line.split('.')[0]}.</span>
                 <span>{parseInline(line.substring(line.indexOf('.') + 1))}</span>
             </div>
         )
      }
      if (line.trim() === '') {
        return <br key={idx} />;
      }
      return <p key={idx} className="text-lg leading-relaxed text-stone-700 mb-4">{parseInline(line)}</p>;
    });
  };

  // Helper for bold text (**text**)
  const parseInline = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-stone-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <article className="max-w-4xl mx-auto px-6 py-12 md:py-16">
      {isTranslating && (
        <div className="fixed top-20 right-6 bg-white p-3 rounded-lg shadow-lg border border-amber-100 flex items-center gap-3 z-30 animate-in fade-in slide-in-from-top-4">
          <Loader2 className="animate-spin w-5 h-5 text-amber-600" />
          <span className="text-sm font-medium text-stone-600">Translating to your language...</span>
        </div>
      )}

      {/* Hero Image */}
      <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden mb-12 shadow-xl group">
        <img 
          src={chapter.imageUrl} 
          alt={displayedTitle}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent flex items-end">
           <div className="p-8">
             <span className="inline-block px-3 py-1 bg-amber-500 text-white text-xs font-bold uppercase tracking-widest rounded-full mb-3">
               {chapter.category}
             </span>
             <h1 className="text-3xl md:text-5xl font-bold text-white serif shadow-sm">{displayedTitle}</h1>
             <p className="text-stone-200 mt-2 font-medium flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-white"></span>
                {chapter.readTime}
             </p>
           </div>
        </div>
      </div>

      {/* Content */}
      <div className={`transition-opacity duration-300 ${isTranslating ? 'opacity-50' : 'opacity-100'}`}>
        {renderContent(displayedContent)}
      </div>

      <div className="mt-16 pt-8 border-t border-stone-200 flex justify-between items-center text-stone-500 text-sm">
        <span>© Practical Country Skills</span>
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="hover:text-amber-600 transition-colors"
        >
          Back to Top ↑
        </button>
      </div>
    </article>
  );
};

export default BookViewer;