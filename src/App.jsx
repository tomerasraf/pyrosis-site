import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { SiteProvider } from './context/SiteContext'
import CartDrawer from './components/Cart/CartDrawer'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import ProtectedRoute from './components/Auth/ProtectedRoute'

// Landing page sections
import Hero from './components/Hero/Hero'
import Marquee from './components/Marquee/Marquee'
import Products from './components/Products/Products'
import VideoFeature from './components/VideoFeature/VideoFeature'
import Benefits from './components/Benefits/Benefits'
import FlavorExplorer from './components/FlavorExplorer/FlavorExplorer'
import Testimonials from './components/Testimonials/Testimonials'

// Pages (lazy loaded)
const ShopPage         = lazy(() => import('./pages/ShopPage'))
const ProductPage      = lazy(() => import('./pages/ProductPage'))
const CheckoutPage     = lazy(() => import('./pages/CheckoutPage'))
const OrderConfirmPage = lazy(() => import('./pages/OrderConfirmPage'))
const AccountPage      = lazy(() => import('./pages/AccountPage'))
const OrdersPage       = lazy(() => import('./pages/OrdersPage'))
const AdminPage        = lazy(() => import('./pages/AdminPage'))

function LandingPage() {
  return (
    <main>
      <Hero />
      <Marquee bg="var(--forest)" color="var(--white)" />
      <Products />
      <VideoFeature />
      <Benefits />
      <Marquee bg="var(--citrus)" color="var(--white)" />
      <FlavorExplorer />
      <Testimonials />
    </main>
  )
}

function PageLoader() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, border: '3px solid var(--cream-dark)', borderTopColor: 'var(--citrus)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
    </div>
  )
}

function AppInner() {
  const location = useLocation()
  const navigate = useNavigate()
  const isAdmin = location.pathname === '/admin'

  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') navigate('/admin')
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [navigate])

  return (
    <>
      {!isAdmin && <Navbar />}
      {!isAdmin && <CartDrawer />}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/"                        element={<LandingPage />} />
          <Route path="/shop"                    element={<ShopPage />} />
          <Route path="/product/:id"             element={<ProductPage />} />
          <Route path="/checkout"                element={<CheckoutPage />} />
          <Route path="/order-confirmation/:id"  element={<OrderConfirmPage />} />
          <Route path="/account"                 element={<AccountPage />} />
          <Route path="/account/orders"          element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
          <Route path="/admin"                   element={<AdminPage />} />
        </Routes>
      </Suspense>
      {!isAdmin && <Footer />}
    </>
  )
}

export default function App() {
  return (
    <SiteProvider>
      <AuthProvider>
        <CartProvider>
          <AppInner />
        </CartProvider>
      </AuthProvider>
    </SiteProvider>
  )
}
