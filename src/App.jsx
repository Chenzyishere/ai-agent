import React from 'react'
import {Route,Routes,Navigate,BrowserRouter} from "react-router-dom";
import { lazy } from 'react';
import {
  InboxOutlined,
  UploadOutlined,
  PaperClipOutlined,
  SendOutlined,
  ReloadOutlined,
  CopyOutlined,
  LikeOutlined,
  DislikeOutlined
} from '@ant-design/icons';

const Homepage = lazy(()=>import("./pages/Homepage"));
const ChatPage = lazy(()=>import("./pages/ChatPage"));
export default function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route index element={<Homepage/>}/>
          <Route path="HomePage" element={<Homepage/>}/>
          <Route path="ChatPage" element={<ChatPage/>}/>
        </Routes>
    </BrowserRouter>

  )
}
