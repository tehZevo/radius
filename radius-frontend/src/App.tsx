import { useState } from 'react'
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate
} from "react-router-dom";
import './App.css'

import Identities from "./pages/identities"
import Login from "./pages/login"
import Profile from "./pages/profile"
import Settings from "./pages/settings"
import Feed from "./pages/feed"
import CreatePost from "./pages/createPost"

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
    path: "/profile/:userId",
    element: <Profile />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/feed",
    element: <Feed />,
  },
  {
    path: "/create-post",
    element: <CreatePost />,
  },
]);

export default function App() {
  
  return (
    // <React.StrictMode>
    //   <RouterProvider router={router} />
    // </React.StrictMode>
    <>
      <div><a href="/feed">Feed</a></div>
      <div><a href="/create-post">Create post</a></div>
      <div><a href="/settings">Settings</a></div>
      <RouterProvider router={router} />
    </>
  );
}
