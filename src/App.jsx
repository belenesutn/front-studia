import "./app.scss";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import React from "react";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Home from "./pages/home/Home";
import About from "./pages/about/about"
import AboutTutor from "./pages/aboutTutor/aboutTutor"
import Gigs from "./pages/gigs/Gigs";
import Gig from "./pages/gig/Gig";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Add from "./pages/add/Add";
import Class from "./pages/class/Class";
import Messages from "./pages/messages/Messages";
import Message from "./pages/message/Message";
import MyGigs from "./pages/myGigs/MyGigs";
import Edit from "./pages/edit/Edit";
import Editgigs from "./pages/editgigs/Editgigs";
import {QueryClient, QueryClientProvider,} from "@tanstack/react-query";
import ReactGA from 'react-ga';
import { useEffect } from 'react';

function initializeReactGA() {
  ReactGA.initialize('G-XKHVTCJT7Y'); 
  ReactGA.pageview(window.location.pathname + window.location.search);
}

function App() {
  useEffect(() => {
    initializeReactGA();
  }, []);
  const queryClient = new QueryClient();
  const Layout = () => {
    return (
      <div className="app">
        <QueryClientProvider client={queryClient}>
        <Navbar />
        <Outlet />
        <Footer />
        </QueryClientProvider>
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/edit",
          element: <Edit />,
        },
        {
          path: "/editgig/:id",
          element: <Editgigs/>,
        },
        {
          path: "/about",
          element: <About />,
        },
        {
          path: "/aboutTutor",
          element: <AboutTutor />,
        },
        {
          path: "/gigs",
          element: <Gigs />,
        },
        {
          path: "/myGigs",
          element: <MyGigs />,
        },
        {
          path: "/class",
          element: <Class />,
        },
        {
          path: "/messages",
          element: <Messages />,
        },
        {
          path: "/message/:id",
          element: <Message />,
        },
        {
          path: "/add",
          element: <Add />,
        },
        {
          path: "/gig/:id",
          element: <Gig />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/login",
          element: <Login />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;