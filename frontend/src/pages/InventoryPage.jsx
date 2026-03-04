import { useState } from 'react';
import mockInventory from '../mock/mockInventory';
import Modal from '../components/Modal';
import InventoryForm from '../components/InventoryForm';
import Button from '../components/Button';

function TypeBadge({ value }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{
        color: 'var(--color-brand)',
        backgroundColor: '#2e1a3a',
        border: '1px solid var(--color-border-subtle)',
      }}
    >
      {value}
    </span>
  );
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState(mockInventory);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState('table');

  function handleOpenModal() {
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
  }

  function handleItemSubmit(formData) {
    setInventory((prev) => [{ ...formData, id: Date.now() }, ...prev]);
    setIsModalOpen(false);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Inventory</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
            {inventory.length} item{inventory.length !== 1 ? 's' : ''} total
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div
            className="flex items-center gap-1 rounded-lg p-1"
            style={{
              backgroundColor: 'var(--color-bg-card)',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            <button
              onClick={() => setView('table')}
              className="rounded-md px-3 py-2.5 text-sm font-semibold transition-colors"
              style={{
                backgroundColor: view === 'table' ? '#2e1a3a' : 'transparent',
                color: view === 'table' ? 'white' : 'var(--color-text-muted)',
              }}
            >
              Table
            </button>
            <button
              onClick={() => setView('grid')}
              className="rounded-md px-3 py-2.5 text-sm font-semibold transition-colors"
              style={{
                backgroundColor: view === 'grid' ? '#2e1a3a' : 'transparent',
                color: view === 'grid' ? 'white' : 'var(--color-text-muted)',
              }}
            >
              Grid
            </button>
          </div>

          <Button onClick={handleOpenModal} className="px-5">
            + New Item
          </Button>
        </div>
      </div>

      {/* Table View */}
      {view === 'table' && (
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: '1px solid var(--color-border-subtle)', backgroundColor: 'var(--color-bg-card)' }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: '#111111' }}>
                {['Name', 'Type', 'Quantity'].map((col) => (
                  <th
                    key={col}
                    className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr
                  key={item.id}
                  className="transition-colors hover:bg-[#222222]"
                  style={{ borderTop: '1px solid var(--color-border-subtle)' }}
                >
                  <td className="px-5 py-4">
                    <p className="font-medium text-white">{item.name}</p>
                  </td>
                  <td className="px-5 py-4">
                    <TypeBadge value={item.type} />
                  </td>
                  <td className="px-5 py-4" style={{ color: 'var(--color-text-muted)' }}>
                    {item.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {inventory.length === 0 && (
            <div className="py-16 text-center" style={{ color: 'var(--color-text-faint)' }}>
              No items yet. Click &ldquo;+ New Item&rdquo; to add one.
            </div>
          )}
        </div>
      )}

      {/* Grid View */}
      {view === 'grid' && (
        <>
          {inventory.length === 0 ? (
            <div
              className="py-16 text-center rounded-xl"
              style={{ color: 'var(--color-text-faint)', border: '1px solid var(--color-border-subtle)' }}
            >
              No items yet. Click &ldquo;+ New Item&rdquo; to add one.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {inventory.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl p-4 flex flex-col gap-3"
                  style={{
                    backgroundColor: 'var(--color-bg-card)',
                    border: '1px solid var(--color-border-subtle)',
                  }}
                >
                  <p className="font-semibold text-white">{item.name}</p>
                  <div>
                    <TypeBadge value={item.type} />
                  </div>
                  <div>
                    <span className="text-xs mr-1" style={{ color: 'var(--color-text-faint)' }}>Qty:</span>
                    <span className="text-sm font-medium text-white">{item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* New Item Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="New Item">
        <InventoryForm
          key={isModalOpen ? 'open' : 'closed'}
          onSubmit={handleItemSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
}
