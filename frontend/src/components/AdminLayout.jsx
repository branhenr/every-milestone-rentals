import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 768);

  return (
    <div className="flex h-screen w-full" style={{ backgroundColor: 'var(--color-bg-page)' }}>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <Sidebar
        isOpen={sidebarOpen}
        onNavigate={() => { if (window.innerWidth < 768) setSidebarOpen(false); }}
      />
      <main className="flex-1 overflow-auto p-6 text-white">
        <button
          onClick={() => setSidebarOpen((prev) => !prev)}
          aria-label="Toggle sidebar"
          className="mb-6 md:hidden flex items-center justify-center w-fit p-2 rounded-lg transition-colors bg-transparent hover:bg-[#2e1a3a]"
          style={{ border: '1px solid var(--color-border-subtle)' }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <Outlet />
      </main>
    </div>
  );
}
