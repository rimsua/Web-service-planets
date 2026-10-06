function Button({
  children,
  variant = "primary",
  size = "medium",
  disabled = false,
  type = "button",
  onClick,
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`btn btn--${variant} btn--${size}`}
    >
      {children}
    </button>
  )
}

export default Button