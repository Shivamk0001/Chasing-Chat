import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
const savedTheme = localStorage.getItem("chat-theme") || "dark";
document.documentElement.setAttribute("data-theme", savedTheme);

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
