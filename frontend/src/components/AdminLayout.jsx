import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 768);

  return (
    <div className="flex h-screen w-full" style={{ backgroundColor: 'var(--color-bg-page)' }}>
      <Sidebar isOpen={sidebarOpen} />
      <main className="flex-1 overflow-auto p-6 text-white">
        <button
          onClick={() => setSidebarOpen((prev) => !prev)}
          aria-label="Toggle sidebar"
          className="mb-6 flex flex-col gap-1.5 p-2 rounded-lg transition-colors"
          style={{
            border: '1px solid var(--color-border-subtle)',
            backgroundColor: 'transparent',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2e1a3a')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <span className="block w-5 h-0.5 bg-white rounded" />
          <span className="block w-5 h-0.5 bg-white rounded" />
          <span className="block w-5 h-0.5 bg-white rounded" />
        </button>
        <Outlet />
      </main>
    </div>
  );
}
