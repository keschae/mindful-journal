import { supabase } from './supabaseClient';
import { JournalEntry } from '../types';

export const getEntries = async (userId: string): Promise<JournalEntry[]> => {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Failed to load entries", error);
    return [];
  }

  return data.map((item: any) => ({
    id: item.id,
    userId: item.user_id,
    title: item.title,
    content: item.content,
    createdAt: new Date(item.created_at).getTime(),
    updatedAt: new Date(item.updated_at).getTime(),
    tags: item.tags || [],
    aiInsight: item.ai_insight
  }));
};

export const saveEntry = async (entry: JournalEntry): Promise<void> => {
  const dbEntry = {
    id: entry.id,
    user_id: entry.userId,
    title: entry.title,
    content: entry.content,
    created_at: new Date(entry.createdAt).toISOString(),
    updated_at: new Date(entry.updatedAt).toISOString(),
    tags: entry.tags,
    ai_insight: entry.aiInsight
  };

  const { error } = await supabase
    .from('journal_entries')
    .upsert(dbEntry);

  if (error) {
    console.error("Failed to save entry", error);
    throw new Error("Could not save entry.");
  }
};

export const deleteEntry = async (entryId: string, userId: string): Promise<void> => {
  // We explicitly match both ID and User ID to ensure we only delete what belongs to the user.
  // We use count: 'exact' to confirm the row was actually removed.
  const { error, count } = await supabase
    .from('journal_entries')
    .delete({ count: 'exact' })
    .match({ id: entryId, user_id: userId });

  if (error) {
    console.error("Failed to delete entry", error);
    throw new Error(error.message || "Failed to delete entry");
  }

  if (count === 0) {
    console.warn(`Delete operation returned 0 rows for ID: ${entryId} and User: ${userId}`);
    throw new Error("Could not delete entry. It may have been already deleted or you don't have permission.");
  }
};