function StarSystemPage({
  starSystem,
  starTypeLabels = {},
  planets = [],
  flashAlert = "",
  flashNotice = ""
}) {
  const csrfToken =
    document.querySelector('meta[name="csrf-token"]')?.content || ""

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
        <a href="/" className="system-back-link">
          ← Все звёздные системы
        </a>

        <form
          action={`/star_systems/${starSystem.id}`}
          method="post"
          onSubmit={(event) => {
            const confirmed = window.confirm(
              `Удалить систему «${starSystem.name}» вместе со всеми её планетами?`
            )

            if (!confirmed) {
              event.preventDefault()
            }
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

          <h1>{starSystem.name}</h1>

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

                <h3>{planet.name}</h3>

                <span className="badge badge--muted">
                  {planetTypeLabels[planet.planet_type] || planet.planet_type}
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
                    const confirmed = window.confirm(
                      `Удалить планету «${planet.name}»?`
                    )

                    if (!confirmed) {
                      event.preventDefault()
                    }
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
    </div>
  )
}

export default StarSystemPage
