function Card({
  title,
  description,
  icon,
  children,
}) {
  return (
    <article className="ui-card">

      {icon && (
        <div className="ui-card__icon">
          {icon}
        </div>
      )}

      {title && (
        <h3>{title}</h3>
      )}

      {description && (
        <p>{description}</p>
      )}

      {children}

    </article>
  )
}

export default Card