import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import BookingsPage from './pages/BookingsPage'
import InventoryPage from './pages/InventoryPage'
import AnalyticsPage from './pages/AnalyticsPage'
import CatalogPage from './pages/CatalogPage'

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<CatalogPage />} />

      {/* Admin routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin/bookings" element={<BookingsPage />} />
      <Route path="/admin/inventory" element={<InventoryPage />} />
      <Route path="/admin/analytics" element={<AnalyticsPage />} />
    </Routes>
  )
}

export default App