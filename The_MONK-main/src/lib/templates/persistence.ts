import { Template, TemplateLanguage, TemplateCategory } from './index';

interface CustomTemplate extends Template {
  id: string;
  isCustom: true;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'monk_custom_templates';

export const saveCustomTemplate = (template: Omit<CustomTemplate, 'id' | 'isCustom' | 'createdAt' | 'updatedAt'>): CustomTemplate => {
  const customTemplates = getCustomTemplates();
  const newTemplate: CustomTemplate = {
    ...template,
    id: crypto.randomUUID(),
    isCustom: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  customTemplates.push(newTemplate);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customTemplates));
  return newTemplate;
};

export const updateCustomTemplate = (id: string, updates: Partial<CustomTemplate>): CustomTemplate | null => {
  const customTemplates = getCustomTemplates();
  const index = customTemplates.findIndex(t => t.id === id);
  
  if (index === -1) return null;
  
  const updatedTemplate = {
    ...customTemplates[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  customTemplates[index] = updatedTemplate;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customTemplates));
  return updatedTemplate;
};

export const deleteCustomTemplate = (id: string): boolean => {
  const customTemplates = getCustomTemplates();
  const filteredTemplates = customTemplates.filter(t => t.id !== id);
  
  if (filteredTemplates.length === customTemplates.length) return false;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredTemplates));
  return true;
};

export const getCustomTemplates = (): CustomTemplate[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading custom templates:', error);
    return [];
  }
};

export const exportTemplates = (): string => {
  const templates = getCustomTemplates();
  return JSON.stringify(templates, null, 2);
};

export const importTemplates = (json: string): CustomTemplate[] => {
  try {
    const templates = JSON.parse(json) as CustomTemplate[];
    if (!Array.isArray(templates)) throw new Error('Invalid template format');
    
    // Validate template structure
    templates.forEach(template => {
      if (!template.id || !template.name || !template.code || !template.language) {
        throw new Error('Invalid template structure');
      }
    });
    
    const existingTemplates = getCustomTemplates();
    const newTemplates = templates.filter(t => 
      !existingTemplates.some(et => et.id === t.id)
    );
    
    if (newTemplates.length > 0) {
      const updatedTemplates = [...existingTemplates, ...newTemplates];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTemplates));
    }
    
    return newTemplates;
  } catch (error) {
    console.error('Error importing templates:', error);
    throw new Error('Failed to import templates: Invalid format');
  }
}; 