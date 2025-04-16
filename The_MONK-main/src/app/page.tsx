"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/sidebar";
import AIChatWindow from "@/components/ai-chat-window";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { getDocumentsFromStorage, saveDocumentToStorage, deleteDocumentFromStorage, Document } from "@/lib/storage";
import DocumentEditor from '@/components/document-editor';

const APP_VERSION = "v1.0";
const APP_NAME = "GodsIMiJ Empire";

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export default function Home() {
  const [documentContent, setDocumentContent] = useState("");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoadDialogOpen, setIsLoadDialogOpen] = useState(false);
  const [newDocumentName, setNewDocumentName] = useState("");
  const [hasMounted, setHasMounted] = useState(false);
  const [isNamingNewDialogOpen, setIsNamingNewDialogOpen] = useState(false);
  const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Function to load the welcome scroll
  const loadWelcomeScroll = async () => {
    try {
      const response = await fetch('/launch-scroll.md');
      const content = await response.text();
      setDocumentContent(content);

      // Create a welcome document if it doesn't exist
      const welcomeDoc = {
        id: 'welcome-scroll',
        name: 'Welcome to The Temple Dojo',
        content: content
      };

      // Save to localStorage
      saveDocumentToStorage(welcomeDoc);

      // Set as current document
      if (typeof window !== "undefined") {
        localStorage.setItem("currentDocumentId", welcomeDoc.id);
        setCurrentDocumentId(welcomeDoc.id);
      }

      return welcomeDoc;
    } catch (error) {
      console.error("Error loading welcome scroll:", error);
      return null;
    }
  };

  useEffect(() => {
    if (hasMounted) {
      // Load documents from localStorage
      const loadedDocuments = getDocumentsFromStorage();
      setDocuments(loadedDocuments);

      // Load current document id after mount
      const currentId = localStorage.getItem("currentDocumentId");

      if (currentId) {
        // If there's a current document, load it
        setCurrentDocumentId(currentId);
        const currentDoc = loadedDocuments.find(doc => doc.id === currentId);
        if (currentDoc) {
          setDocumentContent(currentDoc.content);
        }
      } else {
        // If no current document, load the welcome scroll
        loadWelcomeScroll();
      }
    }
  }, [hasMounted]);

  const handleNewDocument = () => {
    setDocumentContent("");
    if (typeof window !== "undefined") {
      localStorage.removeItem("currentDocumentId");
      setCurrentDocumentId(null);
    }
    setNewDocumentName("");
    setIsNamingNewDialogOpen(true);
    toast({
      title: "New Document",
      description: "Editor cleared.",
    });
  };

  const handleLoadDocument = async (documentId: string) => {
    try {
      const selectedDocument = documents.find((doc) => doc.id === documentId);
      if (selectedDocument) {
        setDocumentContent(selectedDocument.content);
        if (typeof window !== "undefined") {
          localStorage.setItem("currentDocumentId", documentId);
          setCurrentDocumentId(documentId);
        }
        setIsLoadDialogOpen(false);
        toast({
          title: "Document Loaded",
          description: `Loaded: ${selectedDocument.name}`,
        });
      }
    } catch (error) {
      console.error("Error loading document:", error);
      toast({
        title: "Error",
        description: "Failed to load the document.",
      });
    }
  };

  const handleSaveDocument = () => {
    try {
      const currentDocumentId =
        typeof window !== "undefined" ? localStorage.getItem("currentDocumentId") : null;
      if (currentDocumentId) {
        // Update existing document
        const updatedDocument = {
          id: currentDocumentId,
          name: documents.find(doc => doc.id === currentDocumentId)?.name || "Untitled",
          content: documentContent
        };

        // Save to localStorage
        saveDocumentToStorage(updatedDocument);

        // Update state
        const updatedDocuments = documents.map((doc) =>
          doc.id === currentDocumentId ? updatedDocument : doc
        );
        setDocuments(updatedDocuments);

        toast({
          title: "Document Saved",
          description: "Current document updated.",
        });
      } else {
        // Create new document
        if (!newDocumentName) {
          alert("Please enter a name for the new document.");
          return;
        }
        const newDocument: Document = {
          id: generateId(),
          name: newDocumentName,
          content: documentContent,
        };

        // Save to localStorage
        saveDocumentToStorage(newDocument);

        // Update state
        const updatedDocuments = [...documents, newDocument];
        setDocuments(updatedDocuments);

        if (typeof window !== "undefined") {
          localStorage.setItem("currentDocumentId", newDocument.id);
          setCurrentDocumentId(newDocument.id);
        }

        toast({
          title: "New Document Saved",
          description: `Saved as: ${newDocumentName}`,
        });
      }
      setIsNamingNewDialogOpen(false);
    } catch (error) {
      console.error("Error saving document:", error);
      toast({
        title: "Error",
        description: "Failed to save the document.",
      });
    }
  };

  const handleExportDocument = useCallback(() => {
    const currentDocumentId =
      typeof window !== "undefined" ? localStorage.getItem("currentDocumentId") : null;
    const documentName =
      documents.find((doc) => doc.id === currentDocumentId)?.name ||
      "New Document";
    const blob = new Blob([documentContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${documentName}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({
      title: "Document Exported",
      description: `Exported as: ${documentName}.md`,
    });
  }, [documentContent, documents]);

  const handleDocumentContentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDocumentContent(event.target.value);
  };

  const handleImportDocument = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.md';

    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          setDocumentContent(e.target.result);
          toast({
            title: "Document Imported",
            description: `Imported: ${file.name}`,
          });
        };
        reader.onerror = () => {
          toast({
            title: "Error",
            description: "Failed to read the document.",
          });
        };
        reader.readAsText(file);
      }
    };

    input.click();
  };

  return (
    <main className="min-h-screen bg-monk-charcoal text-monk-ash">
      <div className="h-screen flex flex-col">
        {/* Terminal-like header bar */}
        <div className="bg-monk-charcoal border-b border-monk-forest p-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-sm font-mono">The Temple Dojo</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-gray-400 hover:text-gray-200">_</button>
            <button className="text-gray-400 hover:text-gray-200">□</button>
            <button className="text-gray-400 hover:text-gray-200">×</button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="bg-monk-charcoal border-b border-monk-forest p-2 flex items-center justify-center gap-4">
          <Button onClick={handleNewDocument} variant="outline" size="sm" className="bg-monk-charcoal border-monk-moss text-monk-ash hover:bg-monk-forest hover:text-monk-ash">
            New Document
          </Button>
          <Button onClick={() => setIsLoadDialogOpen(true)} variant="outline" size="sm" className="bg-monk-charcoal border-monk-moss text-monk-ash hover:bg-monk-forest hover:text-monk-ash">
            Load Document
          </Button>
          <Button onClick={handleSaveDocument} variant="outline" size="sm" className="bg-monk-charcoal border-monk-moss text-monk-ash hover:bg-monk-forest hover:text-monk-ash">
            Save Document
          </Button>
          <Button onClick={handleImportDocument} variant="outline" size="sm" className="bg-monk-charcoal border-monk-moss text-monk-ash hover:bg-monk-forest hover:text-monk-ash">
            Import
          </Button>
          <Button onClick={handleExportDocument} variant="outline" size="sm" className="bg-monk-charcoal border-monk-moss text-monk-ash hover:bg-monk-forest hover:text-monk-ash">
            Export
          </Button>
          <Button onClick={loadWelcomeScroll} variant="outline" size="sm" className="ml-2 bg-monk-forest/20 hover:bg-monk-gold/30 border-monk-gold/50 text-monk-gold hover:text-monk-charcoal monk-glow">
            🕯️ Temple Scroll
          </Button>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex">
          {/* Document editor takes up most of the space */}
          <div className="flex-1 h-full">
            <DocumentEditor
              initialContent={documentContent}
              onContentChange={setDocumentContent}
            />
          </div>

          {/* The Monk chat takes up a smaller portion */}
          <div className="w-[400px] border-l border-monk-forest h-full">
            <AIChatWindow documentContent={documentContent} />
          </div>
        </div>

        {/* Load document dialog */}
        <Dialog open={isLoadDialogOpen} onOpenChange={setIsLoadDialogOpen}>
          <DialogContent className="bg-monk-charcoal border-monk-forest">
            <DialogHeader>
              <DialogTitle className="text-monk-gold">Load Document</DialogTitle>
              <DialogDescription className="text-monk-moss">
                Select a document to load from your local storage.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {documents.length > 0 ? (
                documents.map((doc) => (
                  <Button
                    key={doc.id}
                    variant="outline"
                    className="justify-start bg-monk-charcoal border-monk-moss text-monk-ash hover:bg-monk-forest hover:text-monk-ash"
                    onClick={() => handleLoadDocument(doc.id)}
                  >
                    {doc.name}
                  </Button>
                ))
              ) : (
                <p className="text-center text-monk-moss">No documents found</p>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* New document dialog */}
        <Dialog open={isNamingNewDialogOpen} onOpenChange={setIsNamingNewDialogOpen}>
          <DialogContent className="bg-monk-charcoal border-monk-forest">
            <DialogHeader>
              <DialogTitle className="text-monk-gold">Name Your Document</DialogTitle>
              <DialogDescription className="text-monk-moss">
                Enter a name for your new document.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right text-monk-ash">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newDocumentName}
                  onChange={(e) => setNewDocumentName(e.target.value)}
                  className="col-span-3 bg-monk-charcoal border-monk-moss text-monk-ash"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSaveDocument} className="bg-monk-forest text-monk-ash hover:bg-monk-gold hover:text-monk-charcoal">Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Footer with version */}
        <div className="bg-monk-charcoal border-t border-monk-forest p-2 text-center text-xs text-monk-moss">
          GodsIMiJ AI Solutions 2025
        </div>
      </div>
    </main>
  );
}
