const gradients = {
  primary: 'linear-gradient(135deg, var(--color-brand-gradient-from) 0%, var(--color-brand-gradient-to) 100%)',
  success: 'linear-gradient(135deg, #166534 0%, #22c55e 100%)',
  danger:  'linear-gradient(135deg, #991b1b 0%, #ef4444 100%)',
};

export default function Button({ children, loading = false, variant = 'primary', className = '', ...props }) {
  const isDisabled = loading || props.disabled;
  return (
    <button
      disabled={isDisabled}
      className={`rounded-lg py-2.5 text-sm font-semibold text-white transition-opacity ${className}`}
      style={{
        background: isDisabled ? 'var(--color-brand-disabled)' : gradients[variant],
        opacity: isDisabled ? 0.7 : 1,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        border: 'none',
      }}
      {...props}
    >
      {children}
    </button>
  );
}
