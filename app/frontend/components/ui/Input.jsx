function Input({
  label,
  type = "text",
  placeholder,
}) {
  return (
    <div className="form__group">

      <label className="form__label">
        {label}
      </label>

      <input
        className="form__input"
        type={type}
        placeholder={placeholder}
      />

    </div>
  )
}

export default Input