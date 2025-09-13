import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { AppStateProvider } from './contexts/AppStateContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/Layout/DashboardLayout';

// Auth Pages
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import ChangePassword from './pages/auth/ChangePassword';

// Dashboard Pages
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ProductList from './pages/products/ProductList';
import ProductView from './pages/products/ProductView';
import ProductEdit from './pages/products/ProductEdit';
import DeletedProductsPage from './pages/products/DeletedProductList';
import CategoryList from './pages/categories/CategoryList';
import CategoryView from './pages/categories/CategoryView';
import CategoryEdit from './pages/categories/CategoryEdit';
import CategoryCreate from './pages/categories/CategoryCreate';
import OrderList from './pages/orders/OrderList';
import OrderDetail from './pages/orders/OrderDetail';
import PincodeList from './pages/pincodes/PincodeList';
import HeroImageList from './pages/hero-images/HeroImageList';
import Notifications from './pages/Notifications';
import UserDetail from './pages/users/UserDetail';
import Users from './pages/users/Users';
import ReferralCodeList from './pages/referral-codes/ReferralCodeList';
import PlatformSettings from './pages/platform-settings/PlatformSettings';
import PayoutList from './pages/payouts/PayoutList';
import PayoutDetail from './pages/payouts/PayoutDetail';
import SizeChartList from './pages/size-charts/SizeChartList';
import SizeChartCreate from './pages/size-charts/SizeChartCreate';
import SizeChartEdit from './pages/size-charts/SizeChartEdit';

function App() {
  return (
    <AppStateProvider>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
              <Routes>
                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                
                {/* Protected Dashboard Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Dashboard />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="change-password" element={<ChangePassword />} />
                  <Route path="products" element={<ProductList />} />
                  <Route path="products/:id/view" element={<ProductView />} />
                  <Route path="products/:id/edit" element={<ProductEdit />} />
                  <Route path="deleted-products" element={<DeletedProductsPage />} />
                  <Route path="categories" element={<CategoryList />} />
                  <Route path="categories/create" element={<CategoryCreate />} />
                  <Route path="categories/:id" element={<CategoryView />} />
                  <Route path="categories/:id/edit" element={<CategoryEdit />} />
                  <Route path="orders" element={<OrderList />} />
                  <Route path="orders/:id" element={<OrderDetail />} />
                  <Route path="pincodes" element={<PincodeList />} />
                  <Route path="hero-images" element={<HeroImageList />} />
                  <Route path="users" element={<Users/>} />
                  <Route path="users/:id" element={<UserDetail/>} />
                  <Route path="referral-codes" element={<ReferralCodeList />} />
                  <Route path="platform-settings" element={<PlatformSettings />} />
                  <Route path="notifications" element={<Notifications />} />
                  <Route path="payouts" element={<PayoutList />} />
                  <Route path="payouts/:id" element={<PayoutDetail />} />
                  <Route path="size-charts" element={<SizeChartList />} />
                  <Route path="size-charts/create" element={<SizeChartCreate />} />
                  <Route path="size-charts/:id/edit" element={<SizeChartEdit />} />
                </Route>
                
                {/* Redirect root to dashboard */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                
                {/* Catch all route for 404 */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </AppStateProvider>
  );
}

export default App;