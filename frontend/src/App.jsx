import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import BookingsPage from './pages/BookingsPage'
import InventoryPage from './pages/InventoryPage'
import AnalyticsPage from './pages/AnalyticsPage'
import CatalogPage from './pages/CatalogPage'
import CalendarPage from './pages/CalendarPage'
import AdminLayout from './components/AdminLayout'

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<CatalogPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Admin routes */}
      <Route element={<AdminLayout />}>
        <Route path="/admin/analytics" element={<AnalyticsPage />} />
        <Route path="/admin/bookings" element={<BookingsPage />} />
        <Route path="/admin/inventory" element={<InventoryPage />} />
        <Route path="/admin/calendar" element={<CalendarPage />} />
      </Route>
    </Routes>
  )
}

export default App