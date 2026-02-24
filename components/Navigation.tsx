import React from 'react';
import { BookOpen, Hammer, Tent, Menu, X } from 'lucide-react';
import { Chapter } from '../types';

interface NavigationProps {
  chapters: Chapter[];
  currentChapterId: string;
  onSelectChapter: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ 
  chapters, 
  currentChapterId, 
  onSelectChapter,
  isOpen,
  onClose
}) => {
  
  const categories = Array.from(new Set(chapters.map(c => c.category))) as string[];

  const getIcon = (cat: string) => {
    switch(cat) {
      case 'Foundation': return <BookOpen className="w-4 h-4" />;
      case 'Tools': return <Hammer className="w-4 h-4" />;
      case 'Builds': return <Tent className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <nav className={`
        fixed top-0 left-0 bottom-0 z-50 w-72 bg-stone-900 text-stone-100 
        transform transition-transform duration-300 ease-in-out border-r border-stone-800
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:static flex flex-col
      `}>
        <div className="p-6 border-b border-stone-800 flex justify-between items-center">
          <div>
            <h1 className="serif text-2xl font-bold tracking-wide text-amber-500">Country Skills</h1>
            <p className="text-xs text-stone-400 mt-1 uppercase tracking-widest">Wood & Tools</p>
          </div>
          <button onClick={onClose} className="md:hidden text-stone-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
          {categories.map(category => (
            <div key={category}>
              <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                {getIcon(category)} {category}
              </h3>
              <ul className="space-y-1">
                {chapters.filter(c => c.category === category).map(chapter => (
                  <li key={chapter.id}>
                    <button
                      onClick={() => {
                        onSelectChapter(chapter.id);
                        if (window.innerWidth < 768) onClose();
                      }}
                      className={`
                        w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200
                        ${currentChapterId === chapter.id 
                          ? 'bg-amber-900/30 text-amber-500 font-medium border-l-2 border-amber-500' 
                          : 'text-stone-300 hover:bg-stone-800 hover:text-stone-100'}
                      `}
                    >
                      {chapter.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-stone-800">
          <div className="bg-stone-800 rounded-lg p-3">
            <h4 className="text-amber-500 text-sm font-bold mb-1">Premium Edition</h4>
            <p className="text-xs text-stone-400">Unlock video guides and blueprints.</p>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;