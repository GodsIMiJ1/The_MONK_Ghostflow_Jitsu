import { typescriptTemplates } from './typescript';
import { javascriptTemplates } from './javascript';
import { pythonTemplates } from './python';

export type TemplateLanguage = 'typescript' | 'javascript' | 'python';
export type TemplateCategory = 'api' | 'server' | 'oop' | 'cli' | 'validation' | 'data' | 'ui' | 'utility';
export type TemplateName = string;

export interface Template {
  name: string;
  description: string;
  code: string;
  language: TemplateLanguage;
  category: TemplateCategory;
  tags: string[];
}

type TemplateMap = {
  [key: string]: {
    code: string;
    category: TemplateCategory;
    tags: string[];
  };
};

const templates: Record<TemplateLanguage, TemplateMap> = {
  typescript: typescriptTemplates,
  javascript: javascriptTemplates,
  python: pythonTemplates,
};

export const getTemplates = (language?: TemplateLanguage, category?: TemplateCategory, searchTerm?: string): Template[] => {
  let result: Template[] = [];
  
  // Filter by language if specified
  const languagesToSearch = language ? [language] : Object.keys(templates) as TemplateLanguage[];
  
  languagesToSearch.forEach(lang => {
    const languageTemplates = templates[lang];
    Object.entries(languageTemplates).forEach(([name, template]) => {
      // Apply filters
      if (category && template.category !== category) return;
      if (searchTerm && !matchesSearch(template, searchTerm)) return;
      
      result.push({
        name,
        description: getTemplateDescription(name),
        code: template.code,
        language: lang,
        category: template.category,
        tags: template.tags,
      });
    });
  });
  
  return result;
};

export const getTemplate = (language: TemplateLanguage, name: TemplateName): Template | undefined => {
  const template = templates[language]?.[name];
  if (!template) return undefined;
  
  return {
    name,
    description: getTemplateDescription(name),
    code: template.code,
    language,
    category: template.category,
    tags: template.tags,
  };
};

const matchesSearch = (template: { category: TemplateCategory; tags: string[] }, searchTerm: string): boolean => {
  const searchLower = searchTerm.toLowerCase();
  return (
    template.category.toLowerCase().includes(searchLower) ||
    template.tags.some(tag => tag.toLowerCase().includes(searchLower))
  );
};

const getTemplateDescription = (name: string): string => {
  const descriptions: Record<string, string> = {
    'hello-world': 'A simple hello world program',
    'express-server': 'Basic Express.js server setup with CORS',
    'flask-server': 'Basic Flask server setup with CORS',
    'react-component': 'A simple React functional component',
    'class-example': 'Example of a class with methods',
    'async-function': 'Asynchronous function with error handling',
    'data-analysis': 'Basic data analysis with pandas and matplotlib',
    'interface-type': 'TypeScript interface and type examples',
    'zod-schema': 'Zod schema validation example',
    'fetch-api': 'Fetch API with async/await',
    'event-listener': 'DOM event listener examples',
    'pandas-quickstart': 'Pandas DataFrame quick start',
    'fastapi-hello': 'FastAPI hello world example',
    'cli-app': 'CLI application with argparse',
  };
  return descriptions[name] || 'No description available';
};

export const getTemplateNames = (language: TemplateLanguage): string[] => {
  return Object.keys(templates[language] || {});
};

export const getCategories = (): TemplateCategory[] => {
  return ['api', 'server', 'oop', 'cli', 'validation', 'data', 'ui', 'utility'];
}; 