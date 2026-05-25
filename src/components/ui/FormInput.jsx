export default function FormInput({
  label,
  type = 'text',
  placeholder,
  error,
  registration,
  ...props
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 ${
          error ? 'border-red-300' : 'border-outline'
        }`}
        {...registration}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error.message}</p>}
    </div>
  )
}