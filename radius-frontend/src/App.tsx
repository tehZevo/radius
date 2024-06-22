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
import Box from "./components/box"

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
    <Box raised={false}>
      <Box><a href="/profile">Profile</a></Box>
      <Box><a href="/feed">Feed</a></Box>
      <Box><a href="/create-post">Create post</a></Box>
      <Box><a href="/settings">Settings</a></Box>
    </Box>
    <RouterProvider router={router} />
    </>
  );
}
