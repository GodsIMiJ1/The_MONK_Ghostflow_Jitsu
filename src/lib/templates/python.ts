export const pythonTemplates = {
  'hello-world': {
    code: `# Python Hello World
def greet(name):
    return f"Hello, {name}!"

print(greet("World"))`,
    category: 'utility',
    tags: ['basic', 'function', 'print']
  },

  'flask-server': {
    code: `from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify({"message": "Welcome to the API"})

if __name__ == '__main__':
    app.run(debug=True, port=3000)`,
    category: 'server',
    tags: ['api', 'flask', 'cors', 'web']
  },

  'class-example': {
    code: `class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def greet(self):
        return f"Hello, my name is {self.name} and I am {self.age} years old."

person = Person("John", 30)
print(person.greet())`,
    category: 'oop',
    tags: ['class', 'constructor', 'methods']
  },

  'async-function': {
    code: `import aiohttp
import asyncio

async def fetch_data(url):
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                if response.status != 200:
                    raise Exception(f"HTTP error! status: {response.status}")
                return await response.json()
    except Exception as e:
        print(f"Error fetching data: {e}")
        raise`,
    category: 'api',
    tags: ['async', 'aiohttp', 'error-handling']
  },

  'data-analysis': {
    code: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Load data
data = pd.read_csv('data.csv')

# Basic analysis
print(data.describe())

# Create a simple plot
plt.figure(figsize=(10, 6))
plt.plot(data['x'], data['y'])
plt.title('Data Analysis')
plt.xlabel('X-axis')
plt.ylabel('Y-axis')
plt.show()`,
    category: 'data',
    tags: ['pandas', 'numpy', 'matplotlib', 'analysis']
  },

  'pandas-quickstart': {
    code: `import pandas as pd
import numpy as np

# Create a DataFrame
df = pd.DataFrame({
    "Name": ["Alice", "Bob", "Charlie"],
    "Age": [25, 30, 35],
    "Score": [85, 92, 88]
})

# Basic operations
print("DataFrame:")
print(df)
print("\nDescriptive statistics:")
print(df.describe())

# Filtering
adults = df[df['Age'] >= 30]
print("\nAdults:")
print(adults)

# Grouping
grouped = df.groupby('Age').mean()
print("\nGrouped by Age:")
print(grouped)`,
    category: 'data',
    tags: ['pandas', 'dataframe', 'analysis', 'filtering']
  },

  'fastapi-hello': {
    code: `from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)`,
    category: 'server',
    tags: ['api', 'fastapi', 'cors', 'async']
  },

  'cli-app': {
    code: `import argparse
import sys

def main():
    parser = argparse.ArgumentParser(
        description="Example CLI app",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter
    )
    
    parser.add_argument(
        '--name',
        type=str,
        required=True,
        help="Your name"
    )
    
    parser.add_argument(
        '--age',
        type=int,
        default=18,
        help="Your age"
    )
    
    parser.add_argument(
        '--verbose',
        action='store_true',
        help="Enable verbose output"
    )
    
    args = parser.parse_args()
    
    if args.verbose:
        print(f"Hello, {args.name}! You are {args.age} years old.")
    else:
        print(f"Hello, {args.name}!")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nExiting...")
        sys.exit(0)`,
    category: 'cli',
    tags: ['argparse', 'command-line', 'arguments']
  }
}; 