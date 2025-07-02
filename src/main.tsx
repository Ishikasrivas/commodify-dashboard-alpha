import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n';

// import { SpeedInsights } from "@vercel/speed-insights/react"
createRoot(document.getElementById("root")!).render(<App />);
