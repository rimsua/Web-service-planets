import { useState } from "react"

function StarSystemPage({
  starSystem,
  starTypeLabels = {},
  planets = [],
  flashAlert = "",
  flashNotice = ""
}) {
  const csrfToken =
    document.querySelector('meta[name="csrf-token"]')?.content || ""

  const [pendingDeletion, setPendingDeletion] = useState(null)

  const [isEditingSystemName, setIsEditingSystemName] = useState(false)
const [systemNameDraft, setSystemNameDraft] = useState(starSystem?.name || "")

const [editingPlanetId, setEditingPlanetId] = useState(null)
const [planetNameDraft, setPlanetNameDraft] = useState("")

  if (!starSystem) {
    return (
      <div className="page system-detail-page">
        <p>Звёздная система не найдена.</p>
        <a href="/" className="btn btn--secondary">
          Вернуться на главную
        </a>
      </div>
    )
  }

  const starType = starSystem.star_type || "G"
  const starLabel =
    starTypeLabels[starType] || `Спектральный класс ${starType}`

  const planetCount = planets.length

  const planetTypeLabels = {
    rocky: "Каменистая",
    gas: "Газовая",
    ice: "Ледяная",
    ocean: "Океаническая",
    lava: "Лавовая"
  }

  const atmosphereLabels = {
    none: "Нет",
    thin: "Разреженная",
    dense: "Плотная"
  }

  return (
    <div className="page system-detail-page">
      <div className="system-page-actions">
        <a href="/star_systems" className="system-back-link">
          ← Все звёздные системы
        </a>

        <form
          action={`/star_systems/${starSystem.id}`}
          method="post"
          onSubmit={(event) => {
            event.preventDefault()

            setPendingDeletion({
              form: event.currentTarget,
              title: "Удалить звёздную систему?",
              message: `Система «${starSystem.name}» и все её планеты будут удалены. Это действие нельзя отменить.`
            })
          }}
        >
          <input
            type="hidden"
            name="authenticity_token"
            value={csrfToken}
          />

          <input
            type="hidden"
            name="_method"
            value="delete"
          />

          <button
            type="submit"
            className="btn btn--danger btn--small"
          >
            Удалить систему
          </button>
        </form>
      </div>

      <section className="system-detail-hero">
        <div
          className={`star-preview star-preview--${starType.toLowerCase()} system-detail-star`}
          aria-hidden="true"
        >
          {starType}
        </div>

        <div className="system-detail-info">
          <p className="eyebrow">
            STAR SYSTEM · SPECTRAL CLASS {starType}
          </p>

          <div className="entity-title-row">
            {isEditingSystemName ? (
              <form
                className="inline-rename-form"
                action={`/star_systems/${starSystem.id}`}
                method="post"
              >
                <input type="hidden" name="authenticity_token" value={csrfToken} />
                <input type="hidden" name="_method" value="patch" />

                <input
                  className="form__input"
                  type="text"
                  name="star_system[name]"
                  value={systemNameDraft}
                  onChange={(event) => setSystemNameDraft(event.target.value)}
                  maxLength={20}
                  required
                  autoFocus
                  aria-label="Новое название звёздной системы"
                />

                <button className="btn btn--primary btn--small" type="submit">Сохранить</button>

                <button
                  className="btn btn--secondary btn--small"
                  type="button"
                  onClick={() => {
                    setSystemNameDraft(starSystem.name)
                    setIsEditingSystemName(false)
                  }}
                >
                  Отмена
                </button>
              </form>
            ) : (
              <>
                <h1>{starSystem.name}</h1>

                <button
                  className="btn btn--secondary btn--small"
                  type="button"
                  onClick={() => {
                    setSystemNameDraft(starSystem.name)
                    setIsEditingSystemName(true)
                  }}
                  aria-label="Изменить название системы"
                >
                  Изменить имя
                </button>
              </>
            )}
          </div>

          <p className="system-detail-type">
            {starLabel}
          </p>
        </div>

        <div className="system-detail-count">
          <span className="system-detail-count__number">
            {planetCount}
          </span>

          <span className="system-detail-count__label">
            {planetCount === 1
              ? "планета"
              : planetCount >= 2 && planetCount <= 4
                ? "планеты"
                : "планет"}
          </span>
        </div>
      </section>

      {flashNotice && (
        <div className="system-notice" role="status">
          {flashNotice}
        </div>
      )}

      {flashAlert && (
        <div className="auth-errors" role="alert">
          <p>{flashAlert}</p>
        </div>
      )}

      <section className="section">
        <div className="section__header">
          <div>
            <p className="eyebrow">YOUR PLANETS</p>
            <h2>Планеты системы</h2>
          </div>

          <span className="badge badge--muted">
            {planetCount}
          </span>
        </div>

        {planetCount === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">✦</div>
            <h3>Здесь пока пусто</h3>
            <p>
              Добавь первую планету, чтобы начать исследовать систему.
            </p>
          </div>
        ) : (
          <div className="planet-grid">
            {planets.map((planet) => (
              <article className="ui-card planet-card" key={planet.id}>
                <div className={`planet-marker planet-marker--${planet.planet_type}`}>
                  ✦
                </div>

                {editingPlanetId === planet.id ? (
                  <form
                    className="inline-rename-form"
                    action={`/star_systems/${starSystem.id}/planets/${planet.id}`}
                    method="post"
                  >
                    <input type="hidden" name="authenticity_token" value={csrfToken} />
                    <input type="hidden" name="_method" value="patch" />

                    <input
                      className="form__input"
                      type="text"
                      name="planet[name]"
                      value={planetNameDraft}
                      onChange={(event) => setPlanetNameDraft(event.target.value)}
                      maxLength={50}
                      required
                      autoFocus
                      aria-label="Новое название планеты"
                    />

                    <button className="btn btn--primary btn--small" type="submit">Сохранить</button>

                    <button
                      className="btn btn--secondary btn--small"
                      type="button"
                      onClick={() => {
                        setPlanetNameDraft("")
                        setEditingPlanetId(null)
                      }}
                    >
                      Отмена
                    </button>
                  </form>
                ) : (
                  <div className="entity-title-row">
                    <h3>{planet.name}</h3>

                    <button
                      className="btn btn--secondary btn--small"
                      type="button"
                      onClick={() => {
                        setPlanetNameDraft(planet.name)
                        setEditingPlanetId(planet.id)
                      }}
                      aria-label={`Изменить название планеты ${planet.name}`}
                    >
                      Изменить имя
                    </button>
                  </div>
                )}

                <span className="badge badge--muted">
                  {planetTypeLabels[planet.planet_type] || planet.planet_type}
                </span>

                <span
                  className={`badge ${
                    planet.habitable ? "badge--success" : "badge--danger"
                  } planet-habitability`}
                >
                  {planet.habitable
                    ? "Потенциально пригодна по модели"
                    : "Не проходит критерии модели"}
                </span>

                <dl className="planet-properties">
                  <div>
                    <dt>Температура</dt>
                    <dd>{planet.temperature} K</dd>
                  </div>

                  <div>
                    <dt>Атмосфера</dt>
                    <dd>{atmosphereLabels[planet.atmosphere] || planet.atmosphere}</dd>
                  </div>

                  <div>
                    <dt>Вода</dt>
                    <dd>{planet.water ? "Есть" : "Нет"}</dd>
                  </div>
                </dl>

                <form
                  action={`/star_systems/${starSystem.id}/planets/${planet.id}`}
                  method="post"
                  className="planet-delete-form"
                  onSubmit={(event) => {
                    event.preventDefault()

                    setPendingDeletion({
                      form: event.currentTarget,
                      title: "Удалить планету?",
                      message: `Планета «${planet.name}» будет удалена. Это действие нельзя отменить.`
                    })
                  }}
                >
                  <input
                    type="hidden"
                    name="authenticity_token"
                    value={csrfToken}
                  />

                  <input
                    type="hidden"
                    name="_method"
                    value="delete"
                  />

                  <button
                    type="submit"
                    className="btn btn--danger btn--small"
                  >
                    Удалить планету
                  </button>
                </form>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="section" id="add-planet">
        <div className="section__header">
          <div>
            <p className="eyebrow">CREATE PLANET</p>
            <h2>Добавить планету</h2>
          </div>
        </div>

        <div className="system-create-panel">
          <form
            action={`/star_systems/${starSystem.id}/planets`}
            method="post"
            className="system-create-form"
          >
            <input
              type="hidden"
              name="authenticity_token"
              value={csrfToken}
            />

            <div className="system-form__field">
              <label htmlFor="planet_name">Название</label>
              <input
                id="planet_name"
                name="planet[name]"
                type="text"
                maxLength={50}
                required
              />
            </div>

            <div className="system-form__field">
              <label htmlFor="planet_type">Тип планеты</label>
              <select
                id="planet_type"
                name="planet[planet_type]"
                defaultValue="rocky"
                required
              >
                <option value="rocky">Каменистая</option>
                <option value="gas">Газовая</option>
                <option value="ice">Ледяная</option>
                <option value="ocean">Океаническая</option>
                <option value="lava">Лавовая</option>
              </select>
            </div>

            <div className="system-form__field">
              <label htmlFor="planet_temperature">
                Температура (Кельвины)
              </label>
              <input
                id="planet_temperature"
                name="planet[temperature]"
                type="number"
                min={0}
                step={1}
                defaultValue={288}
                required
              />
            </div>

            <div className="system-form__field">
              <label htmlFor="planet_atmosphere">Атмосфера</label>
              <select
                id="planet_atmosphere"
                name="planet[atmosphere]"
                defaultValue="dense"
                required
              >
                <option value="none">Нет</option>
                <option value="thin">Разреженная</option>
                <option value="dense">Плотная</option>
              </select>
            </div>

            <div className="system-form__field">
              <label htmlFor="planet_water">Наличие воды</label>
              <select
                id="planet_water"
                name="planet[water]"
                defaultValue="false"
                required
              >
                <option value="false">Нет</option>
                <option value="true">Есть</option>
              </select>
            </div>

            <button type="submit" className="btn btn--primary">
              Добавить планету
            </button>
          </form>

          <div className="planet-random-actions">
            <p className="planet-random-actions__description">
              Не хочешь задавать параметры вручную? Создай планету случайным образом.
            </p>

            <form
              action={`/star_systems/${starSystem.id}/planets/generate_random`}
              method="post"
              className="planet-random-form"
            >
              <input
                type="hidden"
                name="authenticity_token"
                value={csrfToken}
              />

              <div className="system-form__field">
                <label htmlFor="random_planet_name">
                  Название планеты (необязательно)
                </label>

                <input
                  id="random_planet_name"
                  name="planet[name]"
                  type="text"
                  maxLength={50}
                  placeholder="Пустое поле — случайное имя"
                />
              </div>

              <button
                type="submit"
                className="btn btn--secondary"
              >
                ✦ Сгенерировать случайную планету
              </button>
            </form>
          </div>
        </div>
      </section>

      {pendingDeletion && (
        <div
          className="confirm-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setPendingDeletion(null)
            }
          }}
        >
          <section
            className="confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
            aria-describedby="confirm-modal-description"
          >
            <div className="confirm-modal__icon" aria-hidden="true">
              !
            </div>

            <p className="eyebrow">CONFIRM ACTION</p>

            <h2 id="confirm-modal-title">
              {pendingDeletion.title}
            </h2>

            <p id="confirm-modal-description">
              {pendingDeletion.message}
            </p>

            <div className="confirm-modal__actions">
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => setPendingDeletion(null)}
              >
                Отмена
              </button>

              <button
                type="button"
                className="btn btn--danger"
                onClick={() => {
                  const form = pendingDeletion.form
                  setPendingDeletion(null)
                  form.submit()
                }}
              >
                Удалить
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

export default StarSystemPage
