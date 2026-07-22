/**
 * Labelled input with an optional leading icon and inline error.
 * Any extra props (type, autoComplete, required, ...) pass through to <input>.
 */
const FormField = ({
  label,
  icon: Icon,
  error,
  hint,
  id,
  className = "",
  ...inputProps
}) => {
  const inputId = id || inputProps.name;

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        )}

        <input
          id={inputId}
          aria-invalid={Boolean(error)}
          className={`w-full rounded-lg border bg-white py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors focus:ring-2 dark:bg-slate-800 dark:text-slate-100 ${
            Icon ? "pl-9 pr-3" : "px-3"
          } ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500/50"
              : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 dark:border-slate-700"
          }`}
          {...inputProps}
        />
      </div>

      {error ? (
        <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{error}</p>
      ) : (
        hint && (
          <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
            {hint}
          </p>
        )
      )}
    </div>
  );
};

export default FormField;
