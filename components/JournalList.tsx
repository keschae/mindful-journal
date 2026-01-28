import React, { useState } from 'react';
import { JournalEntry, User } from '../types';
import { Button } from './Button';
import { Plus, Search, LogOut, BookOpen, Calendar } from 'lucide-react';

interface JournalListProps {
  user: User;
  entries: JournalEntry[];
  onNewEntry: () => void;
  onSelectEntry: (entry: JournalEntry) => void;
  onLogout: () => void;
}

export const JournalList: React.FC<JournalListProps> = ({ 
  user, 
  entries, 
  onNewEntry, 
  onSelectEntry, 
  onLogout 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEntries = entries.filter(e => 
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(timestamp));
  };

  const getPreview = (content: string) => {
    return content.length > 120 ? content.substring(0, 120) + '...' : content;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-primary-600 p-2 rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">MindfulJourney</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500 hidden sm:inline">Welcome, {user.name}</span>
            <Button variant="ghost" onClick={onLogout} className="text-gray-500 hover:text-rose-600">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="relative w-full sm:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search entries..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition duration-150 ease-in-out shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={onNewEntry} className="w-full sm:w-auto shadow-md">
            <Plus className="h-5 w-5 mr-2" />
            New Entry
          </Button>
        </div>

        {/* Entries Grid */}
        {filteredEntries.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
              <BookOpen className="h-full w-full opacity-50" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No entries found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new journal entry.</p>
            <div className="mt-6">
              <Button onClick={onNewEntry}>
                <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                New Entry
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEntries.map((entry) => (
              <div 
                key={entry.id}
                onClick={() => onSelectEntry(entry)}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100 cursor-pointer group flex flex-col"
              >
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(entry.createdAt)}
                    </div>
                    {entry.aiInsight?.mood && (
                      <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full border border-indigo-100">
                        {entry.aiInsight.mood}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-serif font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">
                    {entry.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-4 journal-font">
                    {getPreview(entry.content)}
                  </p>
                </div>
                {entry.aiInsight?.advice && (
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-3 border-t border-emerald-100">
                     <p className="text-xs text-emerald-800 italic truncate">
                       ✨ Tip: {entry.aiInsight.advice}
                     </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};