import React, { useState, useEffect } from 'react';
import { User, JournalEntry, AppView } from './types';
import { getSession, logout } from './services/authService';
import { getEntries, saveEntry, deleteEntry } from './services/storageService';
import { AuthForms } from './components/AuthForms';
import { JournalList } from './components/JournalList';
import { JournalEditor } from './components/JournalEditor';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<AppView>(AppView.AUTH);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [activeEntry, setActiveEntry] = useState<JournalEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session
  useEffect(() => {
    const initSession = async () => {
      const sessionUser = await getSession();
      if (sessionUser) {
        setUser(sessionUser);
        await loadEntries(sessionUser.id);
        setView(AppView.DASHBOARD);
      }
      setIsLoading(false);
    };
    initSession();
  }, []);

  const loadEntries = async (userId: string) => {
    const loadedEntries = await getEntries(userId);
    setEntries(loadedEntries);
  };

  const handleAuthSuccess = async (loggedInUser: User) => {
    setUser(loggedInUser);
    setIsLoading(true);
    await loadEntries(loggedInUser.id);
    setView(AppView.DASHBOARD);
    setIsLoading(false);
  };

  const handleLogout = async () => {
    setIsLoading(true);
    await logout();
    setUser(null);
    setEntries([]);
    setView(AppView.AUTH);
    setIsLoading(false);
  };

  const handleNewEntry = () => {
    setActiveEntry(null);
    setView(AppView.EDITOR);
  };

  const handleSelectEntry = (entry: JournalEntry) => {
    setActiveEntry(entry);
    setView(AppView.EDITOR);
  };

  const handleSaveEntry = async (entry: JournalEntry) => {
    if (!user) return;
    try {
      await saveEntry(entry);
      await loadEntries(user.id);
      setView(AppView.DASHBOARD);
    } catch (e) {
      alert("Failed to save entry");
      throw e; // Propagate error to editor
    }
  };
  
  const handleDeleteEntry = async (id: string) => {
     if(!user) return;
     try {
       // Pass userId to ensure we own the record we are deleting
       await deleteEntry(id, user.id);
       
       // Refresh the list to confirm deletion
       await loadEntries(user.id);
       
       // Return to dashboard
       setActiveEntry(null);
       setView(AppView.DASHBOARD);
     } catch (e: any) {
       console.error("Delete error in App:", e);
       alert(e.message || "Failed to delete entry. Please try again.");
       throw e; 
     }
  };

  const handleCancelEdit = () => {
    setView(AppView.DASHBOARD);
    setActiveEntry(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
      {view === AppView.AUTH && (
        <AuthForms onAuthSuccess={handleAuthSuccess} />
      )}

      {view === AppView.DASHBOARD && user && (
        <JournalList
          user={user}
          entries={entries}
          onNewEntry={handleNewEntry}
          onSelectEntry={handleSelectEntry}
          onLogout={handleLogout}
        />
      )}

      {view === AppView.EDITOR && user && (
        <JournalEditor
          userId={user.id}
          entry={activeEntry}
          onSave={handleSaveEntry}
          onCancel={handleCancelEdit}
          onDelete={handleDeleteEntry}
        />
      )}
    </div>
  );
};

export default App;