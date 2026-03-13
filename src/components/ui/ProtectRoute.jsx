import React from 'react';
import{Navigate,useLocation} from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';

export default function ProtectedRoute({children}){
    const isAuthenticated = useAuthStore((state)=>state.isAuthenticated);
    const location = useLocation();

    if(!isAuthenticated){
        alert('请先登录')
        return <Navigate to="/login" state={{from: location}} replace/>
    }
    return children;
}