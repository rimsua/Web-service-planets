
import { useState } from "react"

function PublicationToggle({
  systemId,
  published,
  onPublishedChange,
  compact = false
}) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState("")

  const csrfToken =
    document.querySelector('meta[name="csrf-token"]')?.content || ""

  const togglePublication = async (event) => {
    event.preventDefault()
    event.stopPropagation()

    if (isUpdating) return

    const nextPublished = !published
    const action = nextPublished ? "publish" : "unpublish"

    setIsUpdating(true)
    setError("")

    try {
      const response = await fetch(
        `/star_systems/${systemId}/${action}`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "X-CSRF-Token": csrfToken
          }
        }
      )

      let data = {}

      try {
        data = await response.json()
      } catch {
        data = {}
      }

      if (!response.ok) {
        setError(
          data.errors?.join(". ") ||
          "Не удалось изменить статус."
        )
        return
      }

      onPublishedChange(Boolean(data.published))
    } catch {
      setError("Ошибка соединения с сервером.")
    } finally {
      setIsUpdating(false)
    }
  }

  const label = published ? "Публичная" : "Приватная"

  const tooltip = published
    ? "Система опубликована. Другие авторизованные пользователи могут увидеть её в общей вселенной. Нажми, чтобы сделать её приватной."
    : "Система приватная. Её видишь только ты. Нажми, чтобы опубликовать систему и показать её другим пользователям в общей вселенной."

  return (
    <span
      className={`publication-toggle ${
        compact ? "publication-toggle--compact" : ""
      }`}
    >
      <button
        type="button"
        className={`publication-toggle__button ${
          published
            ? "publication-toggle__button--public"
            : "publication-toggle__button--private"
        }`}
        onClick={togglePublication}
        disabled={isUpdating}
        title={tooltip}
      >
        <span className="publication-toggle__dot" />

        {isUpdating
          ? "Сохранение..."
          : label}

        {!isUpdating && (
          <span
            className="publication-toggle__arrow"
            aria-hidden="true"
          >
            ↕
          </span>
        )}
      </button>

      {error && (
        <span className="publication-toggle__error" role="alert">
          {error}
        </span>
      )}
    </span>
  )
}

export default PublicationToggle
