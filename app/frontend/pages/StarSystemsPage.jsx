import { useState } from "react"
import Badge from "../components/ui/Badge"

function StarSystemsPage({
  userNickname,
  starSystems = [],
  starSystemLimit = 10,
  starTypeLabels = {},
  flashAlert = "",
  flashNotice = ""
}) {
  const csrfToken =
    document.querySelector('meta[name="csrf-token"]')?.content || ""

  const [visibleSystems, setVisibleSystems] = useState(starSystems)
  const [localFlashAlert, setLocalFlashAlert] = useState(flashAlert)
  const [localFlashNotice, setLocalFlashNotice] = useState(flashNotice)
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateSystem = async (event) => {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)

    const payload = {
      star_system: {
        name: formData.get("star_system[name]"),
        star_type: formData.get("star_system[star_type]")
      }
    }

    setIsCreating(true)
    setLocalFlashAlert("")
    setLocalFlashNotice("")

    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken
        },
        body: JSON.stringify(payload)
      })

      let data = {}

      try {
        data = await response.json()
      } catch {
        data = {}
      }

      if (!response.ok) {
        const message = Array.isArray(data.errors)
          ? data.errors.join(". ")
          : "Не удалось создать звёздную систему."

        setLocalFlashAlert(message)
        return
      }

      setVisibleSystems((current) => [data, ...current])
      setLocalFlashNotice("Звёздная система успешно создана.")
      form.reset()
    } catch {
      setLocalFlashAlert(
        "Не удалось связаться с сервером. Попробуй ещё раз."
      )
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="page">
      <section className="section">
        <div className="section__header">
          <div>
            <p className="eyebrow">YOUR UNIVERSE</p>
            <h1>Мои звёздные системы</h1>
            <p className="text-muted">
              Здесь можно создавать системы и открывать уже существующие.
            </p>
          </div>

          <Badge>
            {visibleSystems.length} / {starSystemLimit}
          </Badge>
        </div>

        {localFlashAlert && (
          <div className="auth-errors" role="alert">
            <p>{localFlashAlert}</p>
          </div>
        )}

        {localFlashNotice && (
          <div className="system-notice" role="status">
            {localFlashNotice}
          </div>
        )}

        <div className="system-workspace">
          <div className="system-create-panel" id="create-star-system">
            <p className="eyebrow">NEW SYSTEM</p>
            <h2>Создать звёздную систему</h2>

            {visibleSystems.length >= starSystemLimit ? (
              <p className="text-muted">
                Достигнут лимит в {starSystemLimit} систем.
              </p>
            ) : (
              <form
                action="/star_systems"
                method="post"
                className="system-create-form"
                onSubmit={handleCreateSystem}
              >
                <input
                  type="hidden"
                  name="authenticity_token"
                  value={csrfToken}
                />

                <div className="system-form__field">
                  <label htmlFor="star_system_name">
                    Название системы
                  </label>

                  <input
                    id="star_system_name"
                    name="star_system[name]"
                    type="text"
                    maxLength={20}
                    required
                  />
                </div>

                <div className="system-form__field">
                  <label htmlFor="star_system_star_type">
                    Тип звезды
                  </label>

                  <select
                    id="star_system_star_type"
                    name="star_system[star_type]"
                    defaultValue="G"
                    required
                  >
                    {Object.entries(starTypeLabels).map(([type, label]) => (
                      <option key={type} value={type}>
                        {type} — {label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn btn--primary"
                  disabled={isCreating}
                >
                  {isCreating ? "Создание…" : "Создать систему"}
                </button>
              </form>
            )}
          </div>

          <div className="system-list">
            {visibleSystems.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state__icon">✦</div>
                <h3>Здесь пока пусто</h3>
                <p>
                  Создай первую звёздную систему, чтобы начать исследование.
                </p>
              </div>
            ) : (
              <div className="system-grid">
                {visibleSystems.map((system) => (
                  <a
                    href={`/star_systems/${system.id}`}
                    className="system-card-link"
                    key={system.id}
                    aria-label={`Открыть звёздную систему ${system.name}`}
                  >
                    <article className="ui-card system-card">
                      <div
                        className={`star-preview star-preview--${system.star_type.toLowerCase()}`}
                        aria-hidden="true"
                      >
                        {system.star_type}
                      </div>

                      <p className="eyebrow">
                        SPECTRAL CLASS {system.star_type}
                      </p>

                      <h3>{system.name}</h3>

                      <p>
                        {starTypeLabels[system.star_type] ||
                          `Спектральный класс ${system.star_type}`}
                      </p>

                      <p className="system-card-planet-count">
                        Планет: {system.planet_count ?? 0}
                      </p>

                      <span className="system-card-link__hint">
                        Открыть систему →
                      </span>
                    </article>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default StarSystemsPage