// Local storage utility for document management

const LOCAL_STORAGE_KEY = "miniCodexDocuments";

export interface Document {
  id: string;
  name: string;
  content: string;
}

// Get all documents from localStorage
export const getDocumentsFromStorage = (): Document[] => {
  if (typeof window === "undefined") return [];
  
  try {
    const storedDocuments = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedDocuments ? JSON.parse(storedDocuments) : [];
  } catch (error) {
    console.error("Error loading documents from localStorage:", error);
    return [];
  }
};

// Save a document to localStorage
export const saveDocumentToStorage = (document: Document): void => {
  if (typeof window === "undefined") return;
  
  try {
    const documents = getDocumentsFromStorage();
    const existingDocIndex = documents.findIndex(doc => doc.id === document.id);
    
    if (existingDocIndex >= 0) {
      // Update existing document
      documents[existingDocIndex] = document;
    } else {
      // Add new document
      documents.push(document);
    }
    
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(documents));
  } catch (error) {
    console.error("Error saving document to localStorage:", error);
  }
};

// Delete a document from localStorage
export const deleteDocumentFromStorage = (documentId: string): void => {
  if (typeof window === "undefined") return;
  
  try {
    const documents = getDocumentsFromStorage();
    const updatedDocuments = documents.filter(doc => doc.id !== documentId);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedDocuments));
  } catch (error) {
    console.error("Error deleting document from localStorage:", error);
  }
};
