import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import UserLogin from '../pages/auth/UserLogin'
import UserRegister from '../pages/auth/UserRegister'
import FoodPartnerLogin from '../pages/auth/FoodPartnerLogin'
import FoodPartnerRegister from '../pages/auth/FoodPartnerRegister'
import ChooseRegistration from '../pages/auth/ChooseRegistration'
import Home from '../pages/general/Home'
import OrderPage from '../pages/general/OrderPage'
import OrderTracking from '../pages/general/OrderTracking'
import Profile from '../pages/food-partner/Profile'
import PartnerDashboard from '../pages/food-partner/PartnerDashboard'
import CreateFood from '../pages/food-partner/CreateFood'

function AppRoutes() {
  return (
    <Router>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/store/:id" element={<Profile />} />
            <Route path="/order/:foodId" element={<OrderPage />} />
            <Route path="/order-tracking/:orderId" element={<OrderTracking />} />
            <Route path="/register" element={<ChooseRegistration />} />
            <Route path="/user/register" element={<UserRegister />} />
            <Route path="/user/login" element={<UserLogin />} />
            <Route path="/user/home" element={<Home />} />
            <Route path="/foodpartner/dashboard" element={<PartnerDashboard />} />
            <Route path="/foodpartner/login" element={<FoodPartnerLogin />} />
            <Route path="/foodpartner/register" element={<FoodPartnerRegister />} />
            <Route path="/create-food" element={<CreateFood />} />
        </Routes>
    </Router>
  )
}

export default AppRoutes