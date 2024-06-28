import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './App.css'

import Identities from "./pages/identities"
import Login from "./pages/login"
import Profile from "./pages/profile"
import Settings from "./pages/settings"
import Feed from "./pages/feed"
import CreatePost from "./pages/createPostPage"
import TopBar from "./components/topBar"

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
    <>
      <TopBar />
      <RouterProvider router={router} />
    </>
  );
}
