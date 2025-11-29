import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router'
import { router } from './router/router';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './assets/css/toast.css';


//react -query 설정
const queryClient = new QueryClient({
    defaultOptions: {
      queries :{
        retry : 1,
        staleTime : 1 * 60 * 1000,
        gcTime:  1 * 60 * 1000,
        refetchOnWindowFocus: true // 포커스를 다시 받았을 때 재실행 여부 
      }
    }
});

function App() {
  return (
    <>
    
     <QueryClientProvider client={queryClient}>
        <ToastContainer
          position="top-center"
          autoClose={3000}       // 3초 후 자동 닫힘
          icon={false}
        />
       <RouterProvider router={router}/>
     </QueryClientProvider>
    </>
  )
}

export default App
