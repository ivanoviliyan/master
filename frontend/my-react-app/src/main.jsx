import "./index.css";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Login from './components/Login/Login';
import Signup from './components/Singup/Singup';
import Home from './components/Home/Home';
import ProjectDetails from './components/ProjectDetails/ProjectDetails';
import { Options } from "./components/Options/Options";
import CreateProject from './components/CreateProject/CreateProject'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/home',
    element: <Home />,
  },
  {
    path: 'projects/:id',
    element: <ProjectDetails />,
  },
  {
    path: '/options',
    element: <Options />,
  },
  {
    path: '/create-project',
    element: <CreateProject/>,
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
