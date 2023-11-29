import "core-js/stable";
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from "./app/App";
import "./globals.css";

ReactDOM.createRoot(document.getElementById('root')!)
        .render(<App />);
