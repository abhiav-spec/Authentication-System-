function AuthCard({ children, cardRef }) {
  return (
    <div
      ref={cardRef}
      className="auth-card relative w-full max-w-md rounded-3xl border border-white/20 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-xl"
    >
      <div className="pointer-events-none absolute -inset-px rounded-3xl border border-cyan-200/20" />
      {children}
    </div>
  );
}

export default AuthCard;
