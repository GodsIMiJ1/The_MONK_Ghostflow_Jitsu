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
import TabSwitcher from "@/components/TabSwitcher";
import { getDocumentsFromStorage, saveDocumentToStorage, deleteDocumentFromStorage, Document } from "@/lib/storage";
import DocumentEditor from '@/components/document-editor';
import { NavigationBar } from "@/components/NavigationBar";
import { Plus, Save, FolderOpen, Download } from 'lucide-react';

const APP_VERSION = "v4.2.1 – Temple Dojo Edition";
const APP_NAME = "THE MONK";

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
  const [isNewDocDialogOpen, setIsNewDocDialogOpen] = useState(false);
  const [documentName, setDocumentName] = useState('');

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
    setIsNewDocDialogOpen(true);
    setDocumentContent('');
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

        // Also save to local file system
        handleExportDocument();

        toast({
          title: "Document Saved",
          description: "Current document updated and exported to file.",
        });
      } else {
        // If no current document, prompt for name
        setIsNamingNewDialogOpen(true);
      }
    } catch (error) {
      console.error("Error saving document:", error);
      toast({
        title: "Error",
        description: "Failed to save the document.",
      });
    }
  };

  const handleSaveAsDocument = () => {
    // Always show the naming dialog for Save As
    setIsNamingNewDialogOpen(true);
  };

  const handleSaveNewDocument = () => {
    try {
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

      // Also save to local file system
      const blob = new Blob([documentContent], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${newDocumentName}.md`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "New Document Saved",
        description: `Saved as: ${newDocumentName}`,
      });

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

  if (!hasMounted) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-monk-charcoal text-monk-ash">
      <NavigationBar
        appName={APP_NAME}
        appVersion={APP_VERSION}
        onNew={handleNewDocument}
        onSave={handleSaveDocument}
        onSaveAs={handleSaveAsDocument}
        onLoad={() => setIsLoadDialogOpen(true)}
      />

      <main className="flex-1 flex overflow-hidden">
        <SidebarProvider>
          {/* Main Content Area */}
          <div className="flex h-full w-full flex-1">
            {/* Left Side - TabSwitcher (Terminal/Editor) */}
            <div className="w-1/2 border-r border-gray-700">
              <TabSwitcher />
            </div>
            {/* Right Side - Monk Chat */}
            <div className="w-1/2 bg-monk-charcoal rounded-tl-2xl">
              <div className="p-6 border-b border-monk-forest">
                <h2 className="text-2xl font-bold text-monk-sacred-teal">The MONK</h2>
                <p className="text-monk-spirit-whisper mt-2">where Left Hand Strikes. & the Right Hand Guides.</p>
              </div>
              <div className="h-[calc(100vh-180px)] p-4">
                <AIChatWindow
                  documentContent={documentContent}
                  onDocumentUpdate={setDocumentContent}
                />
              </div>
            </div>
          </div>
        </SidebarProvider>
      </main>

      {/* Dialogs */}
      <Dialog open={isNamingNewDialogOpen} onOpenChange={setIsNamingNewDialogOpen}>
        <DialogContent className="bg-monk-charcoal border border-monk-forest rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-monk-gold">Name Your Document</DialogTitle>
            <DialogDescription className="text-monk-moss">
              Give your new document a name before saving.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-monk-ash">
                Document Name
              </Label>
              <Input
                id="name"
                value={newDocumentName}
                onChange={(e) => setNewDocumentName(e.target.value)}
                className="bg-monk-charcoal border-monk-forest text-monk-ash rounded-xl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleSaveNewDocument}
              className="bg-monk-forest hover:bg-monk-gold text-monk-ash rounded-xl"
            >
              Save Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Load Document Dialog */}
      <Dialog open={isLoadDialogOpen} onOpenChange={setIsLoadDialogOpen}>
        <DialogContent className="bg-monk-charcoal border border-monk-forest rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-monk-gold">Load Document</DialogTitle>
            <DialogDescription className="text-monk-moss">
              Choose a document to load.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {documents.map((doc) => (
              <Button
                key={doc.id}
                variant="ghost"
                className="w-full justify-start text-monk-moss hover:text-monk-gold rounded-xl"
                onClick={() => handleLoadDocument(doc.id)}
              >
                {doc.name}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* New Document Dialog */}
      <Dialog open={isNewDocDialogOpen} onOpenChange={setIsNewDocDialogOpen}>
        <DialogContent className="bg-monk-scroll-parchment/90 backdrop-blur-md p-6 rounded-2xl border-2 border-monk-sacred-teal shadow-2xl w-full max-w-md">
          <h2 className="text-2xl font-bold text-monk-zen-black mb-4">New Document</h2>
          <input
            type="text"
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
            placeholder="Enter document name..."
            className="w-full p-3 rounded-xl border-2 border-monk-bamboo-jade bg-monk-scroll-parchment/50 focus:border-monk-sacred-teal focus:outline-none mb-4"
          />
          <div className="flex justify-end gap-3">
            <Button
              onClick={() => setIsNewDocDialogOpen(false)}
              className="btn-ghost rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                // Create new document logic
                setIsNewDocDialogOpen(false);
              }}
              className="btn-primary rounded-xl"
            >
              Create
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
