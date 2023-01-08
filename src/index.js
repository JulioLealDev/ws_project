import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createDriver, Neo4jProvider } from "use-neo4j";

const driver = createDriver(
  "neo4j+s",
  "dec4674f.databases.neo4j.io",
  7687,
  "neo4j",
  "9ITCEsYvbiaUfyEZPZ91gZwrzgr2zHL-ame75EyTEqk",
  {}
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Neo4jProvider driver={driver}>
      <App />
    </Neo4jProvider>
  </React.StrictMode>
);

