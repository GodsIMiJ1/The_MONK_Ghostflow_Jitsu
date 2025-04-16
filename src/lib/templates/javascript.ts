export const javascriptTemplates = {
  'hello-world': {
    code: `// JavaScript Hello World
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));`,
    category: 'utility',
    tags: ['basic', 'function', 'console']
  },

  'express-server': {
    code: `const express = require('express');
const cors = require('cors');

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

const Component = ({ title, children }) => {
  return (
    <div className="component">
      <h1>{title}</h1>
      {children}
    </div>
  );
};

export default Component;`,
    category: 'ui',
    tags: ['react', 'component', 'props']
  },

  'class-example': {
    code: `class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    return \`Hello, my name is \${this.name} and I am \${this.age} years old.\`;
  }
}

const person = new Person('John', 30);
console.log(person.greet());`,
    category: 'oop',
    tags: ['class', 'constructor', 'methods']
  },

  'async-function': {
    code: `async function fetchData(url) {
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

  'fetch-api': {
    code: `async function getData(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(\`HTTP error! status: \${res.status}\`);
    }
    const data = await res.json();
    console.log(data);
    return data;
  } catch (err) {
    console.error('Error fetching data:', err);
    throw err;
  }
}

// Usage example
getData('https://api.example.com/data')
  .then(data => console.log('Data received:', data))
  .catch(error => console.error('Failed to fetch data:', error));`,
    category: 'api',
    tags: ['fetch', 'async', 'await', 'promise']
  },

  'event-listener': {
    code: `// HTML: <button id="btn">Click me</button>

document.getElementById("btn").addEventListener("click", () => {
  alert("Button clicked!");
});

// With event delegation
document.addEventListener("click", (event) => {
  if (event.target.matches(".action-button")) {
    console.log("Action button clicked:", event.target);
  }
});`,
    category: 'ui',
    tags: ['dom', 'events', 'event-delegation']
  }
}; 