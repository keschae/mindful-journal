import React, { useState, useEffect } from 'react';
import { JournalEntry } from '../types';
import { Button } from './Button';
import { ConfirmationModal } from './ConfirmationModal';
import { analyzeJournalEntry } from '../services/geminiService';
import { Sparkles, Save, ArrowLeft, Trash2 } from 'lucide-react';

interface JournalEditorProps {
  entry?: JournalEntry | null;
  userId: string;
  onSave: (entry: JournalEntry) => Promise<void>;
  onCancel: () => void;
  onDelete?: (id: string) => Promise<void>;
}

export const JournalEditor: React.FC<JournalEditorProps> = ({ entry, userId, onSave, onCancel, onDelete }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [aiInsight, setAiInsight] = useState<JournalEntry['aiInsight'] | undefined>(undefined);

  useEffect(() => {
    if (entry) {
      setTitle(entry.title);
      setContent(entry.content);
      setAiInsight(entry.aiInsight);
    } else {
      // Default boilerplate for new entry
      const now = new Date();
      setTitle(now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
      setContent('');
      setAiInsight(undefined);
    }
  }, [entry]);

  const handleSave = async () => {
    if (!content.trim()) return;
    setIsSaving(true);

    const newEntry: JournalEntry = {
      id: entry ? entry.id : crypto.randomUUID(),
      userId,
      title: title || 'Untitled Entry',
      content,
      createdAt: entry ? entry.createdAt : Date.now(),
      updatedAt: Date.now(),
      tags: entry ? entry.tags : [],
      aiInsight
    };

    try {
      await onSave(newEntry);
    } catch (error) {
      console.error("Failed to save", error);
      setIsSaving(false);
    }
  };

  // 1. Initial click just opens the modal
  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  // 2. Confirmed action inside the modal
  const handleConfirmDelete = async () => {
    if (!entry || !onDelete) return;

    setIsDeleting(true);
    try {
      await onDelete(entry.id);
      // App.tsx handles navigation away on success
    } catch (error) {
      console.error("Delete failed in editor", error);
      setIsDeleting(false);
      setShowDeleteModal(false); // Close modal on error so user sees context
    }
  };

  const handleAiAnalysis = async () => {
    if (!content.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const result = await analyzeJournalEntry(title, content);
      setAiInsight(result);
    } catch (error) {
      alert("Failed to analyze entry. Please ensure you have configured the API Key in the environment.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={onCancel} className="pl-0 text-gray-500 hover:text-gray-800">
          <ArrowLeft className="w-5 h-5 mr-1" /> Back
        </Button>
        <div className="flex space-x-3">
          {entry && onDelete && (
             <Button 
               variant="danger" 
               type="button"
               onClick={handleDeleteClick} 
               disabled={isSaving || isDeleting}
               className="bg-rose-600 text-white hover:bg-rose-700 border-transparent focus:ring-rose-500"
             >
                <Trash2 className="w-4 h-4 mr-2" /> Delete
             </Button>
          )}
          <Button 
            onClick={handleSave} 
            disabled={!content.trim() || isDeleting || isSaving}
            isLoading={isSaving}
          >
            <Save className="w-4 h-4 mr-2" /> Save
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor Area */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 md:p-10 border border-gray-100 min-h-[70vh] flex flex-col">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="text-3xl font-bold text-gray-800 placeholder-gray-300 border-none focus:ring-0 p-0 mb-6 w-full font-serif"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your thoughts here..."
            className="flex-grow w-full resize-none border-none focus:ring-0 text-lg leading-relaxed text-gray-600 journal-font bg-transparent placeholder-gray-300"
          />
        </div>

        {/* AI Sidebar / Insights */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl shadow-sm border border-indigo-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-indigo-900 flex items-center">
                <Sparkles className="w-4 h-4 mr-2 text-indigo-500" />
                AI Reflection
              </h3>
            </div>
            
            {!aiInsight ? (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500 mb-4">Get insights, mood analysis, and stoic advice on your entry.</p>
                <Button 
                  variant="secondary" 
                  onClick={handleAiAnalysis} 
                  isLoading={isAnalyzing}
                  disabled={!content.trim()}
                  className="w-full text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                >
                  Analyze with Gemini
                </Button>
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Mood</span>
                  <div className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                    {aiInsight.mood}
                  </div>
                </div>
                
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Summary</span>
                  <p className="mt-1 text-sm text-gray-700 italic">"{aiInsight.summary}"</p>
                </div>

                <div className="pt-4 border-t border-indigo-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Guidance</span>
                  <p className="mt-2 text-sm text-gray-800 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                    {aiInsight.advice}
                  </p>
                </div>

                <Button 
                  variant="ghost" 
                  onClick={handleAiAnalysis} 
                  isLoading={isAnalyzing}
                  className="w-full text-xs text-indigo-400 hover:text-indigo-600 mt-2"
                >
                  Refresh Analysis
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal 
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Entry"
        message="Are you sure you want to delete this journal entry? This action cannot be undone."
        confirmText="Delete"
        isLoading={isDeleting}
      />
    </div>
  );
};