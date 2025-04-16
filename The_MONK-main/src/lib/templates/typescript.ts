export const typescriptTemplates = {
  'hello-world': {
    code: `// TypeScript Hello World
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));`,
    category: 'utility',
    tags: ['basic', 'function', 'console']
  },

  'express-server': {
    code: `import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

app.listen(port, () => {
  console.log(\`Server running on port \${port}\`);
});`,
    category: 'server',
    tags: ['api', 'express', 'cors', 'middleware']
  },

  'react-component': {
    code: `import React from 'react';

interface Props {
  title: string;
  children?: React.ReactNode;
}

export const Component: React.FC<Props> = ({ title, children }) => {
  return (
    <div className="component">
      <h1>{title}</h1>
      {children}
    </div>
  );
};`,
    category: 'ui',
    tags: ['react', 'component', 'typescript', 'props']
  },

  'class-example': {
    code: `class Person {
  private name: string;
  private age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  public greet(): string {
    return \`Hello, my name is \${this.name} and I am \${this.age} years old.\`;
  }
}

const person = new Person('John', 30);
console.log(person.greet());`,
    category: 'oop',
    tags: ['class', 'constructor', 'methods', 'encapsulation']
  },

  'async-function': {
    code: `async function fetchData(url: string): Promise<any> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}`,
    category: 'api',
    tags: ['async', 'await', 'fetch', 'error-handling']
  },

  'interface-type': {
    code: `interface User {
  id: number;
  name: string;
  isActive: boolean;
}

type Status = 'active' | 'inactive';

// Usage example
const user: User = {
  id: 1,
  name: 'John Doe',
  isActive: true
};

const status: Status = 'active';`,
    category: 'utility',
    tags: ['types', 'interface', 'type-alias', 'union-types']
  },

  'zod-schema': {
    code: `import { z } from 'zod';

// Define a schema
const userSchema = z.object({
  id: z.number(),
  name: z.string().min(2),
  email: z.string().email(),
  age: z.number().min(18).optional()
});

// Parse and validate data
const data = {
  id: 1,
  name: 'John',
  email: 'john@example.com',
  age: 25
};

try {
  const validatedData = userSchema.parse(data);
  console.log('Valid data:', validatedData);
} catch (error) {
  console.error('Validation error:', error);
}`,
    category: 'validation',
    tags: ['zod', 'schema', 'validation', 'type-safety']
  }
}; 