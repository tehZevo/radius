import { useState } from 'react'
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate
} from "react-router-dom";
// import './App.css'

import Identities from "./pages/identities"
import Login from "./pages/login"
import Profile from "./pages/profile"
import Settings from "./pages/settings"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Identities />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
]);

export default function App() {
  
  return (
    // <React.StrictMode>
    //   <RouterProvider router={router} />
    // </React.StrictMode>
    <>
      <div><a href="/settings">test</a></div>
      <RouterProvider router={router} />
    </>
  );
}
