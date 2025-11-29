import { createBrowserRouter, Navigate } from "react-router";
import Layout from "../pages/Layout";
import Main from "../pages/main/Main";
import Login from "../pages/login/Login";
import FindId from "../pages/login/FindId";
import FindPw from "../pages/login/FindPw";
import SignUp from "../pages/login/SignUp";
import ProductLayout from "../components/product/Layout";
import List from "../pages/product/List";
import Detail from "../pages/product/Detail";
import Store from "../pages/store/Store";
import BoardList from "../pages/board/BoardList";
import BoardDetail from "../pages/board/BoardDetail";
import BoardForm from "../pages/board/BoardForm";
import MypageLayout from "../components/mypage/Layout";
import WishList from "../pages/mypage/WishList";
import Point from "../pages/mypage/Point";
import LoginLayout from "../components/login/LoginLayout";
import Coupon from "../pages/mypage/Coupon";
import DailyCheck from "../pages/mypage/DailyCheck";
import EditProfile from "../pages/mypage/EditProfile";
import AdminProtectedRoute from "../components/admin/AdminProtectedRoute";
import NotAuthorized from "../components/NotAuthorized";
import AdminProductList from "../pages/admin/product/AdminProductList";
import SubLayout from "../pages/SubLayout";
import AdminProductUpdate from "../pages/admin/product/AdminProductUpdate";
import UserList from "../pages/admin/user/UserList";
import AdminCategory from "../pages/admin/category/AdminCategory";
import AdminCouponRegistList from "../pages/admin/coupon/RegistrationList";
import AdminCouponGrantList from "../pages/admin/coupon/GrantList";
import AdminBanner from "../pages/admin/banner/AdminBanner";
import UserProtectedRoute from "../components/mypage/UserProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="main" replace />,
      },
      {
        path: "main",
        element: <Main />,
      },
      {
        element: <LoginLayout/>,
        path: "login",
        children: [
          {
            index: true,
            element: <Login/>,
          },
          {
            path: "findId",
            element: <FindId />,
          },
          {
            path: "findPw",
            element: <FindPw />,
          },
          {
            path: "signUp",
            element: <SignUp />,
          },
        ],
      },
      {
        element: <ProductLayout />,
        path: "product",
        children: [
          {
            path: ":sourceChain/:promoType?/:productType?",
            element:<List />
          },
          {
            path:':sourceChain/:promoType?/:productType?/:productId?',
            element:<Detail />
          }
        ],
      },

      {
        element:<SubLayout/>,
        path: "board",
        children: [
          {
            index: true,
            element: <BoardList/>,
          },
          {
            path: ":boardId",
            element: <BoardDetail />,
          },
          {
            path: ":boardId/update",
            element: <BoardForm type="update" />,
          },
          {
            path: ":boardId/write",
            element: <BoardForm type="write" />,
          },
        ],
      },
      {
        element: <Store />,
        path: "store",
      },
      {
        path: "mypage",
        element: (
          <UserProtectedRoute>
            <MypageLayout />
          </UserProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="wish" replace />
          },
          {
            path: "wish",
            element: <WishList />,
          },
          {
            path: "point",
            element: <Point />,
          },
          {
            path: "coupon",
            element: <Coupon />,
          },
          {
            path: "check",
            element: <DailyCheck />,
          },
          {
            path: "profile",
            element: <EditProfile />,
          },
        ],
      },
      //관리자페이지
      { 
        path: "admin",
        element: (
          <AdminProtectedRoute>
            <SubLayout />
          </AdminProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="product" replace />
          },
          {
            path: "product",
            element: <AdminProductList/>,
          },
          {
            path: "product/update/:productId?",
            element: <AdminProductUpdate/>,
          },
          {
            path: "user",
            element: <UserList/>,
          },
          {
            path: "board",
            element: <BoardList />,
          },
          {
            path: "board/:boardId",
            element: <BoardDetail />,
          },
          {
            path: "board/:boardId/update",
            element: <BoardForm type="update" />,
          },
          {
            path: "board/:boardId/write",
            element: <BoardForm type="write" />,
          },
          {
            path: "category",
            element: <AdminCategory />
          },
          {
            path: "coupon/regist",
            element: <AdminCouponRegistList />
          },   
          {
            path: "coupon/grant",
            element: <AdminCouponGrantList />
          },         
          {
            path: "banner",
            element: <AdminBanner />
          },  
        ],
      },
      // 접근 차단 페이지 등록
      {
        path: "not-authorized",
        element: <NotAuthorized />,
      },
      
    ],
  },
]);
