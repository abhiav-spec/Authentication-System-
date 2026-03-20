function InputField({
  label,
  type = 'text',
  value,
  onChange,
  name,
  autoComplete,
  inputRef,
}) {
  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder=" "
        autoComplete={autoComplete}
        className="peer w-full rounded-xl border border-white/20 bg-slate-950/50 px-4 pb-2 pt-6 text-slate-100 outline-none transition duration-300 focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-400/30"
      />
      <label
        htmlFor={name}
        className="pointer-events-none absolute left-4 top-2 text-xs tracking-wide text-slate-300 transition-all duration-300 peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-cyan-200"
      >
        {label}
      </label>
    </div>
  );
}

export default InputField;
