import React from 'react'
import {Route,Routes,Navigate,BrowserRouter} from "react-router-dom";
import { lazy } from 'react';

const Homepage = lazy(()=>import("./pages/Homepage"));
const ChatPage = lazy(()=>import("./pages/ChatPage"));
export default function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route index element={<Homepage/>}/>
          <Route path="ChatPage" element={<ChatPage/>}/>
        </Routes>
    </BrowserRouter>

  )
}
