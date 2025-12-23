import { X, Plus, Save, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Note {
  id: string;
  userId: string;
  bookId: string;
  chapterId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface NotesPanelProps {
  bookId: string;
  chapterId: string;
  onClose: () => void;
}

export default function NotesPanel({ bookId, chapterId, onClose }: NotesPanelProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, [bookId, chapterId]);

  const fetchNotes = async () => {
    // TODO: Implement notes API endpoint
    // For now, using local storage as a fallback
    const savedNotes = localStorage.getItem(`notes_${bookId}_${chapterId}`);
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    setLoading(true);
    const note: Note = {
      id: Date.now().toString(),
      userId: 'current-user-id',
      bookId,
      chapterId,
      content: newNote,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedNotes = [...notes, note];
    setNotes(updatedNotes);
    localStorage.setItem(`notes_${bookId}_${chapterId}`, JSON.stringify(updatedNotes));
    setNewNote('');
    setLoading(false);
  };

  const handleUpdateNote = async (noteId: string) => {
    if (!editingContent.trim()) return;

    setLoading(true);
    const updatedNotes = notes.map((note) =>
      note.id === noteId
        ? { ...note, content: editingContent, updatedAt: new Date().toISOString() }
        : note
    );
    setNotes(updatedNotes);
    localStorage.setItem(`notes_${bookId}_${chapterId}`, JSON.stringify(updatedNotes));
    setEditingNoteId(null);
    setEditingContent('');
    setLoading(false);
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!window.confirm('Bu notu silmek istediğinize emin misiniz?')) return;

    setLoading(true);
    const updatedNotes = notes.filter((note) => note.id !== noteId);
    setNotes(updatedNotes);
    localStorage.setItem(`notes_${bookId}_${chapterId}`, JSON.stringify(updatedNotes));
    setLoading(false);
  };

  return (
    <div className="w-96 bg-white border-l shadow-lg flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-bold">Notlarım</h2>
        <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
          <X size={18} />
        </button>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {notes.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p className="mb-2">Henüz not eklenmemiş</p>
            <p className="text-sm">Aşağıdan ilk notunuzu ekleyin</p>
          </div>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="card bg-yellow-50 border border-yellow-200 shadow-sm">
              <div className="card-body p-3">
                {editingNoteId === note.id ? (
                  <>
                    <textarea
                      className="textarea textarea-bordered w-full"
                      rows={3}
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      autoFocus
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleUpdateNote(note.id)}
                        disabled={loading}
                        className="btn btn-primary btn-xs gap-1"
                      >
                        <Save size={14} />
                        Kaydet
                      </button>
                      <button
                        onClick={() => {
                          setEditingNoteId(null);
                          setEditingContent('');
                        }}
                        className="btn btn-ghost btn-xs"
                      >
                        İptal
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">{note.content}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {new Date(note.updatedAt).toLocaleDateString('tr-TR')}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            setEditingNoteId(note.id);
                            setEditingContent(note.content);
                          }}
                          className="btn btn-ghost btn-xs"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="btn btn-ghost btn-xs text-error"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Note Form */}
      <div className="p-4 border-t bg-gray-50">
        <textarea
          className="textarea textarea-bordered w-full mb-2"
          placeholder="Yeni not ekle..."
          rows={3}
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
              handleAddNote();
            }
          }}
        />
        <button
          onClick={handleAddNote}
          disabled={!newNote.trim() || loading}
          className="btn btn-primary btn-sm w-full gap-2"
        >
          <Plus size={16} />
          Not Ekle
        </button>
        <p className="text-xs text-gray-500 mt-2 text-center">Ctrl + Enter ile hızlı ekle</p>
      </div>
    </div>
  );
}

