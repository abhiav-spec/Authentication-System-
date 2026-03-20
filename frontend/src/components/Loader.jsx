function Loader({ label = 'Loading...' }) {
  return (
    <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-200">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-300/40 border-t-cyan-300" />
      {label}
    </div>
  );
}

export default Loader;
