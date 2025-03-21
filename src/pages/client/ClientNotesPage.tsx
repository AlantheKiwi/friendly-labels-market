
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2 } from "lucide-react";
import ClientLayout from "@/components/client/ClientLayout";

const ClientNotesPage = () => {
  // Mock data for notes since we don't have a notes table yet
  const [notes, setNotes] = useState([
    {
      id: "1",
      title: "Printer Settings",
      content: "Optimal settings for Zebra ZD620: Darkness: 15, Speed: 6ips, Temperature: 25°C",
      date: "2024-05-15"
    },
    {
      id: "2",
      title: "Label Measurements",
      content: "Standard shipping labels: 4\" x 6\", Barcode labels: 2\" x 1\"",
      date: "2024-05-10"
    }
  ]);
  
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [editingNote, setEditingNote] = useState<null | { id: string, title: string, content: string }>(null);
  
  const addNote = () => {
    if (newNote.title.trim() && newNote.content.trim()) {
      const note = {
        id: Date.now().toString(),
        title: newNote.title,
        content: newNote.content,
        date: new Date().toISOString().split('T')[0]
      };
      setNotes([note, ...notes]);
      setNewNote({ title: "", content: "" });
    }
  };
  
  const updateNote = () => {
    if (editingNote && editingNote.title.trim() && editingNote.content.trim()) {
      setNotes(notes.map(note => 
        note.id === editingNote.id 
          ? { ...note, title: editingNote.title, content: editingNote.content } 
          : note
      ));
      setEditingNote(null);
    }
  };
  
  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    if (editingNote?.id === id) {
      setEditingNote(null);
    }
  };
  
  return (
    <ClientLayout>
      <h1 className="text-3xl font-bold mb-6">My Notes</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{editingNote ? "Edit Note" : "Add New Note"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              placeholder="Title"
              value={editingNote ? editingNote.title : newNote.title}
              onChange={(e) => editingNote 
                ? setEditingNote({...editingNote, title: e.target.value}) 
                : setNewNote({...newNote, title: e.target.value})
              }
            />
            <Textarea
              placeholder="Content"
              className="min-h-32"
              value={editingNote ? editingNote.content : newNote.content}
              onChange={(e) => editingNote 
                ? setEditingNote({...editingNote, content: e.target.value}) 
                : setNewNote({...newNote, content: e.target.value})
              }
            />
            <div className="flex gap-2">
              {editingNote ? (
                <>
                  <Button onClick={updateNote}>Update Note</Button>
                  <Button variant="outline" onClick={() => setEditingNote(null)}>Cancel</Button>
                </>
              ) : (
                <Button className="flex items-center gap-2" onClick={addNote}>
                  <Plus className="h-4 w-4" />
                  Add Note
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((note) => (
          <Card key={note.id} className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{note.title}</span>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setEditingNote({ id: note.id, title: note.title, content: note.content })}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => deleteNote(note.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
              <p className="text-sm text-gray-500">{new Date(note.date).toLocaleDateString()}</p>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="whitespace-pre-line">{note.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {notes.length === 0 && (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">You don't have any notes yet. Create one above.</p>
        </div>
      )}
    </ClientLayout>
  );
};

export default ClientNotesPage;
