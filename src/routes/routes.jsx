/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';
import ChatLayout from '../layouts/ChatLayout';

//home Page
const Home = lazy(() => import('@pages/homepages/Home'));
const Login = lazy(() => import('@pages/login/Login'));
const ForgotPassword = lazy(() => import('@pages/forgotPassword/ForgotPassword'));
const AboutUs = lazy(() => import('@pages/AboutUs/AboutUs'));
const Details = lazy(() => import('@pages/UserRole/Details'));

// user Role
const ProductPage = lazy(() => import('@pages/UserRole/ProductPage'));
const Cart = lazy(() => import('@pages/UserRole/Cart'));
const SellerPage = lazy(() => import('@pages/SellerRole/SellerPage'));
const ProfileOfSeller = lazy(() => import('@pages/SellerRole/ProfileOfSeller'));
const OrderPageOfSeller = lazy(() => import('@pages/SellerRole/OrderPageOfSeller'));
const OrderDetailPage = lazy(() => import('@pages/SellerRole/OrderDetailPage'));
const UserProfile = lazy(() => import('@pages/UserRole/UserProfile'));
const ShopPage = lazy(() => import('@pages/UserRole/ShopPage'));
const Order = lazy(() => import('@pages/UserRole/Order'));
const DetailShop = lazy(() => import('@pages/UserRole/DetailShop'));
const OrderConfirm = lazy(() => import('@pages/UserRole/OrderConfirm'));
const DiscountPage = lazy(() => import('@pages/SellerRole/DiscountPage'));
const OrderDetailPageCustomer = lazy(() => import('@pages/UserRole/OrderDetailPageCustomer'));
const Wishlist = lazy(() => import('@pages/UserRole/Wishlist'));
const RegisterShop = lazy(() => import('@pages/UserRole/RegisterShop'));
const OrderList = lazy(() => import('@pages/UserRole/OrderList'));
const SaleData = lazy(() => import('@pages/SellerRole/SellData'));
const Feedback = lazy(() => import('@pages/UserRole/FeedBack'));
// admin Role
const AccountManager = lazy(() => import('@pages/AdminRole/AccountManager'));
const ApprovedShop = lazy(() => import('@pages/AdminRole/ApprovedShop'));
const ApprovedProduct = lazy(() => import('@pages/AdminRole/ApproveProduct'));
const WithdrawalAdmin = lazy(() => import('@pages/AdminRole/WithdrawalAdmin'));
// const AdminPage = lazy(() => import('@pages/AdminRole/AdminPage'));
const Dashboard = lazy(() => import('@pages/Dashboard/ECommerce'));
const ProfileAdmin = lazy(() => import('@pages/Dashboard/Profile'));
const AdminSetting = lazy(() => import('@pages/Dashboard/Settings'));

// const SalePage = lazy(() => import("@pages/SaleRole/SalePage"));
const Withdrawal = lazy(() => import('@pages/SellerRole/Withdrawal'));

//Chat Page
const ChatPage = lazy(() => import('@pages/SellerRole/ChatPage'));

export const routes_here = [
  {
    path: '/',
    element: <Home />,
    layout: 'user',
    isPrivate: false,
  },
  {
    path: '/login',
    element: <Login />,
    layout: null,
    isPrivate: false,
  },
  {
    path: '/forgotPassword',
    element: <ForgotPassword />,
    layout: null,
    isPrivate: false,
  },
  {
    path: '/aboutus',
    element: <AboutUs />,
    layout: 'user',
    isPrivate: false,
  },
  {
    path: '/admin/user',
    element: <AccountManager />,
    layout: 'admin',
    isPrivate: true,
  },
  {
    path: '/admin',
    element: <Dashboard />,
    layout: 'admin',
    isPrivate: true,
  },
  {
    path: '/admin/profile',
    element: <ProfileAdmin />,
    layout: 'admin',
    isPrivate: true,
  },
  {
    path: '/admin/settings',
    element: <AdminSetting />,
    layout: 'admin',
    isPrivate: true,
  },
  {
    path: '/admin/registerShopForm',
    element: <ApprovedShop />,
    layout: 'admin',
    isPrivate: true,
  },
  {
    path: '/admin/registerProductForm',
    element: <ApprovedProduct />,
    layout: 'admin',
    isPrivate: true,
  },
  {
    path: '/admin/allWithdrawals',
    element: <WithdrawalAdmin />,
    layout: 'admin',
    isPrivate: true,
  },
  {
    path: '/cart',
    element: <Cart />,
    layout: 'customer',
    isPrivate: true,
  },
  {
    path: '/wishlist',
    element: <Wishlist />,
    layout: 'customer',
    isPrivate: true,
  },
  {
    path: '/feedbackProduct/:orderId/:id',
    element: <Feedback />,
    layout: 'customer',
    isPrivate: false,
  },
  {
    path: '/products',
    element: <ProductPage />,
    layout: 'user',
    isPrivate: false,
  },
  {
    path: '/shops',
    element: <ShopPage />,
    layout: 'user',
    isPrivate: false,
  },
  {
    path: '/detailOrder/:orderId',
    element: <OrderDetailPageCustomer />,
    layout: 'customer',
    isPrivate: false,
  },
  {
    path: '/orderlist/:id',
    element: <OrderList />,
    layout: 'customer',
    isPrivate: false,
  },
  {
    path: '/registerShop',
    element: <RegisterShop />,
    layout: 'customer',
    isPrivate: false,
  },
  {
    path: '/shop/:name/home/:id',
    element: <SellerPage />,
    layout: 'seller',
    isPrivate: false,
  },
  {
    path: '/shop/:name/orders/:id',
    element: <OrderPageOfSeller />,
    layout: 'seller',
    isPrivate: false,
  },
  {
    path: '/shop/:name/:id/orders/order-detail/:orderId',
    element: <OrderDetailPage />,
    layout: 'seller',
    isPrivate: false,
  },
  {
    path: '/shop/:name/voucher/:id',
    element: <DiscountPage />,
    layout: 'seller',
    isPrivate: false,
  },
  {
    path: '/shop/:name/voucher/:id',
    element: <DiscountPage />,
    layout: 'seller',
    isPrivate: false,
  },
  {
    path: '/shop/:name/profile/:id',
    element: <ProfileOfSeller />,
    layout: 'seller',
    isPrivate: false,
  },
  {
    path: '/shop/:name/withdrawals/:id',
    element: <Withdrawal />,
    layout: 'seller',
    isPrivate: false,
  },
  {
    path: '/shop/:name/saleData/:id',
    element: <SaleData />,
    layout: 'seller',
    isPrivate: false,
  },
  {
    path: '/userprofile',
    element: <UserProfile />,
    layout: 'user',
    isPrivate: false,
  },
  {
    path: '/admin-profile',
    element: <UserProfile />,
    layout: 'admin',
    isPrivate: false,
  },

  {
    path: '/orderdetails/:orderId',
    element: <OrderDetailPageCustomer />,
    layout: 'user',
    isPrivate: false,
  },

  {
    path: '/details/:id',
    element: <Details />,
    layout: 'user',
    isPrivate: false,
  },
  {
    path: '/order',
    element: <Order />,
    layout: 'user',
    isPrivate: false,
  },
  {
    path: '/shops/detailShop/:id',
    element: <DetailShop />,
    layout: 'user',
    isPrivate: false,
  },

  {
    path: '/orderconfirm',
    element: <OrderConfirm />,
    layout: 'user',
    isPrivate: false,
  },
  // {
  //   path: '/shops',
  //   element: <SellerPage />,
  //   layout: 'user',
  //   isPrivate: false,
  // },
  // {
  //   path: "/sales",
  //   element: <SalePage />,
  //   layout: "sale",
  //   isPrivate: true,
  // },
  {
    path: '/:name/chat/:id/:chatId?',
    element: <ChatLayout />,
    layout: 'user',
    isPrivate: true,
  },
];
