const FormField = ({
  user = 'user',
  type,
  placeholder,
  name,
  register,
  error,
  id,
  label,
  disabled = false,
}) => (
  <div className="flex flex-col w-full mb-2">
    <label htmlFor={id} className="capitalize">
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      {...register(name)}
      id={id}
      className={`${
        user === 'user' ? 'focus:outline-uAccent' : 'focus:outline-sAccent'
      }`}
      disabled={disabled}
    />
    {error && (
      <span className="text-sm font-medium text-red-500 leading-1 italic ">
        {error.message}
      </span>
    )}
  </div>
)
export default FormField
