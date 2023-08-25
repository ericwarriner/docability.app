import ReactDOM from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'
import { ThemeProvider } from "@material-tailwind/react";


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(

    <BrowserRouter>
        <>
        <ThemeProvider>
          <App />
        </ThemeProvider>
        </>
    </BrowserRouter>

)
