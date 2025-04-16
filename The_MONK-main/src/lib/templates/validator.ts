import { Template, TemplateLanguage } from './index';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

const validateTypeScript = (code: string): ValidationResult => {
  try {
    // Basic TypeScript validation
    if (!code.includes('export') && !code.includes('import')) {
      return {
        isValid: false,
        errors: ['TypeScript code should include export or import statements'],
      };
    }
    return { isValid: true, errors: [] };
  } catch (error) {
    return {
      isValid: false,
      errors: ['Failed to validate TypeScript code'],
    };
  }
};

const validateJavaScript = (code: string): ValidationResult => {
  try {
    // Basic JavaScript validation
    if (code.includes('import') && !code.includes('from')) {
      return {
        isValid: false,
        errors: ['Invalid import statement in JavaScript code'],
      };
    }
    return { isValid: true, errors: [] };
  } catch (error) {
    return {
      isValid: false,
      errors: ['Failed to validate JavaScript code'],
    };
  }
};

const validatePython = (code: string): ValidationResult => {
  try {
    // Basic Python validation
    if (code.includes('import') && !code.includes('from') && !code.includes('as')) {
      return {
        isValid: false,
        errors: ['Invalid import statement in Python code'],
      };
    }
    return { isValid: true, errors: [] };
  } catch (error) {
    return {
      isValid: false,
      errors: ['Failed to validate Python code'],
    };
  }
};

export const validateTemplate = (template: Partial<Template>): ValidationResult => {
  const errors: string[] = [];

  // Validate required fields
  if (!template.name) errors.push('Template name is required');
  if (!template.code) errors.push('Template code is required');
  if (!template.language) errors.push('Template language is required');
  if (!template.category) errors.push('Template category is required');

  // Validate code based on language
  if (template.code && template.language) {
    let validationResult: ValidationResult;
    
    switch (template.language) {
      case 'typescript':
        validationResult = validateTypeScript(template.code);
        break;
      case 'javascript':
        validationResult = validateJavaScript(template.code);
        break;
      case 'python':
        validationResult = validatePython(template.code);
        break;
      default:
        validationResult = { isValid: false, errors: ['Unsupported language'] };
    }

    if (!validationResult.isValid) {
      errors.push(...validationResult.errors);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateTemplateCode = (code: string, language: TemplateLanguage): ValidationResult => {
  switch (language) {
    case 'typescript':
      return validateTypeScript(code);
    case 'javascript':
      return validateJavaScript(code);
    case 'python':
      return validatePython(code);
    default:
      return { isValid: false, errors: ['Unsupported language'] };
  }
}; 