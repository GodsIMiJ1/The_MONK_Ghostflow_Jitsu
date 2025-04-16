import React, { useState, useEffect } from 'react';
import { getTemplates, getCategories, Template, TemplateLanguage, TemplateCategory } from '../lib/templates';
import { saveCustomTemplate, updateCustomTemplate, deleteCustomTemplate, getCustomTemplates, exportTemplates, importTemplates } from '../lib/templates/persistence';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './TemplateManager.css';

const TemplateManager: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<TemplateLanguage | ''>('');
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | ''>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    code: '',
    language: '' as TemplateLanguage,
    category: '' as TemplateCategory,
    tags: [] as string[],
  });
  const [newTag, setNewTag] = useState('');
  const categories = getCategories();

  useEffect(() => {
    const filteredTemplates = getTemplates(
      selectedLanguage as TemplateLanguage,
      selectedCategory as TemplateCategory,
      searchTerm
    );
    const customTemplates = getCustomTemplates();
    setTemplates([...filteredTemplates, ...customTemplates]);
  }, [selectedLanguage, selectedCategory, searchTerm]);

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setIsEditing(false);
  };

  const handleInsert = () => {
    if (selectedTemplate) {
      // Emit event or call callback to insert the template
      console.log('Inserting template:', selectedTemplate.code);
    }
  };

  const handleEdit = () => {
    if (selectedTemplate) {
      setEditForm({
        name: selectedTemplate.name,
        description: selectedTemplate.description,
        code: selectedTemplate.code,
        language: selectedTemplate.language,
        category: selectedTemplate.category,
        tags: selectedTemplate.tags,
      });
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    if (selectedTemplate && 'id' in selectedTemplate) {
      // Update existing template
      const updated = updateCustomTemplate(selectedTemplate.id, editForm);
      if (updated) {
        setSelectedTemplate(updated);
        setIsEditing(false);
      }
    } else {
      // Save new template
      const saved = saveCustomTemplate(editForm);
      setSelectedTemplate(saved);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (selectedTemplate && 'id' in selectedTemplate) {
      if (deleteCustomTemplate(selectedTemplate.id)) {
        setSelectedTemplate(null);
        setIsEditing(false);
      }
    }
  };

  const handleExport = () => {
    const json = exportTemplates();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'monk-templates.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const json = e.target?.result as string;
          const imported = importTemplates(json);
          console.log('Imported templates:', imported);
        } catch (error) {
          console.error('Import failed:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const addTag = () => {
    if (newTag && !editForm.tags.includes(newTag)) {
      setEditForm({
        ...editForm,
        tags: [...editForm.tags, newTag],
      });
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setEditForm({
      ...editForm,
      tags: editForm.tags.filter(t => t !== tag),
    });
  };

  return (
    <div className="template-manager">
      <div className="filters">
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value as TemplateLanguage)}
        >
          <option value="">All Languages</option>
          <option value="typescript">TypeScript</option>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value as TemplateCategory)}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <button onClick={handleExport}>Export Templates</button>
        <input
          type="file"
          accept=".json"
          onChange={handleImport}
          style={{ display: 'none' }}
          id="import-templates"
        />
        <button onClick={() => document.getElementById('import-templates')?.click()}>
          Import Templates
        </button>
      </div>

      <div className="template-list">
        {templates.map((template) => (
          <div
            key={`${template.language}-${template.name}`}
            className={`template-item ${selectedTemplate?.name === template.name ? 'selected' : ''}`}
            onClick={() => handleTemplateSelect(template)}
          >
            <h3>{template.name}</h3>
            <p>{template.description}</p>
            <div className="tags">
              {template.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedTemplate && (
        <div className="template-preview">
          <h3>Preview</h3>
          {isEditing ? (
            <div className="edit-form">
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="Template name"
              />
              <input
                type="text"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                placeholder="Description"
              />
              <select
                value={editForm.language}
                onChange={(e) => setEditForm({ ...editForm, language: e.target.value as TemplateLanguage })}
              >
                <option value="typescript">TypeScript</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
              </select>
              <select
                value={editForm.category}
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value as TemplateCategory })}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
              <div className="tag-input">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag"
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
                <button onClick={addTag}>Add</button>
              </div>
              <div className="tags">
                {editForm.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                    <button onClick={() => removeTag(tag)}>×</button>
                  </span>
                ))}
              </div>
              <textarea
                value={editForm.code}
                onChange={(e) => setEditForm({ ...editForm, code: e.target.value })}
                placeholder="Template code"
              />
              <div className="edit-actions">
                <button onClick={handleSave}>Save</button>
                <button onClick={() => setIsEditing(false)}>Cancel</button>
                {'id' in selectedTemplate && (
                  <button onClick={handleDelete} className="delete">Delete</button>
                )}
              </div>
            </div>
          ) : (
            <>
              <SyntaxHighlighter
                language={selectedTemplate.language}
                style={vscDarkPlus}
                showLineNumbers
              >
                {selectedTemplate.code}
              </SyntaxHighlighter>
              <div className="preview-actions">
                <button onClick={handleInsert}>Insert Template</button>
                <button onClick={handleEdit}>Edit</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TemplateManager; 