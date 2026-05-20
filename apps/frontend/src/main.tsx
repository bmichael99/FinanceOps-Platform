import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider} from 'react-router-dom'
import './index.css'
import routes from './routes.tsx'
import {AuthProvider} from "./context/XAuthProvider.jsx";
import VerifyCountProvider from './context/VerifyCountProvider.tsx'

const router = createBrowserRouter(routes);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <VerifyCountProvider>
        <RouterProvider router={router}/>
      </VerifyCountProvider>
    </AuthProvider>
  </StrictMode>,
)
