import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/home/Home";
import Login from "../pages/login/Login";
import Register from "../pages/register/Register";
import Account from "../pages/account/Account";
import Detail from "../pages/account/components/detail/Detail";
import Man from "../pages/man/Man";
import Collection from "../components/collection/Collection";
import Woman from "../pages/woman/Woman";
import Favori from "../pages/wishlist/Favori";
import Detailpro from "../pages/detail/Detailpro";
import Basket from "../pages/basket/Basket";
import About from "../pages/about/About";
import Checkout from "../pages/checkout/Checkout";
import Success from "../pages/success/Success";
import Address from "../pages/account/components/address/Address";
import AdminPanel from "../pages/admin/AdminPanel";
import AdminProducts from "../pages/admin/components/admin_products/AdminProducts";
import AddProducts from "../pages/admin/components/add_products/AddProducts";
import Users from "../pages/admin/components/users/Users";
import AddUsers from "../pages/admin/components/add_users/AddUsers";
import Orders from "../pages/admin/components/orders/Orders";
import Dashboard from "../pages/admin/components/dashboard/Dashboard";
import { useSelector } from "react-redux";
import AdminRoute from "../pages/admin/router/AdminRoute";
import Purchases from "../pages/account/components/purchases/Purchases";
const Router = () => {
  const { me } = useSelector((state) => state.users);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<Account />} />
        <Route path="/detail" element={<Detail />} />
        <Route path="/address" element={<Address />} />
        <Route path="/purchases" element={<Purchases />} />
        <Route path="/man" element={<Man />} />
        <Route path="/woman" element={<Woman />} />
        <Route path="/category/:name" element={<Collection />} />
        <Route path="/category/:name/:category" element={<Collection />} />
        <Route path="/wishlist" element={<Favori />} />
        <Route
          path="/category/:name/detail-collection"
          element={<Detailpro />}
        />
        <Route path="/basket" element={<Basket />} />
        <Route path="/about" element={<About />} />
        <Route path="/checkout/:orderId" element={<Checkout />} />
        <Route path="/success" element={<Success />} />

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminPanel />}>
            <Route index element={<Dashboard />} />
            <Route path="admin-products" element={<AdminProducts />} />
            <Route path="add-products" element={<AddProducts />} />
            <Route path="users" element={<Users />} />
            <Route path="add-users" element={<AddUsers />} />
            <Route path="orders" element={<Orders />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
