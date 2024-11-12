import { App } from './App'
import { Main } from './Main.js'
import { createRoot } from 'react-dom/client'

Main.Init();

createRoot(document.getElementById('root')).render(
  <App />
)