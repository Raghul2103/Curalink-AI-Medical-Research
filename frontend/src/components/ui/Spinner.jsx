export default function Spinner({ size = 'md' }) {
  const s = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-12 h-12' : 'w-8 h-8';
  return (
    <div className="relative inline-flex items-center justify-center">
      <div className={`${s} border-4 border-red-500/10 rounded-full`} />
      <div className={`${s} border-4 border-red-600 border-t-transparent rounded-full animate-spin absolute inset-0 shadow-lg shadow-red-500/20`} />
    </div>
  );
}
