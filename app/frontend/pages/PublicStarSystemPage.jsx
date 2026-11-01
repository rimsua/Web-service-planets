function PublicStarSystemPage({
  starSystem = null,
  starTypeLabels = {},
  planets = []
}) {
  if (!starSystem) {
    return (
      <div className="page system-detail-page">
        <p>Звёздная система не найдена.</p>

        <a href="/universe" className="btn btn--secondary">
          Вернуться во вселенную
        </a>
      </div>
    )
  }

  const starType = starSystem.star_type || "G"

  const starLabel =
    starTypeLabels[starType] || `Спектральный класс ${starType}`

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

  const planetCount = planets.length

  const planetCountLabel =
    planetCount === 1
      ? "планета"
      : planetCount >= 2 && planetCount <= 4
        ? "планеты"
        : "планет"

  return (
    <div className="page system-detail-page">
      <div className="system-page-actions">
        <a href="/universe" className="system-back-link">
          ← Общая вселенная
        </a>

        <span className="badge badge--success">
          Публичная система
        </span>
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
            PUBLIC STAR SYSTEM · {starType}
          </p>

          <h1>{starSystem.name}</h1>

          <p className="system-detail-type">
            {starLabel}
          </p>

          <p className="public-system-owner">
            Автор: {starSystem.owner_nickname}
          </p>
        </div>

        <div className="system-detail-count">
          <span className="system-detail-count__number">
            {planetCount}
          </span>

          <span className="system-detail-count__label">
            {planetCountLabel}
          </span>
        </div>
      </section>

      <section className="section">
        <div className="section__header">
          <div>
            <p className="eyebrow">PLANETS</p>
            <h2>Планеты системы</h2>
          </div>

          <span className="badge badge--muted">
            {planetCount}
          </span>
        </div>

        {planetCount === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">✦</div>

            <h3>В этой системе пока нет планет</h3>

            <p>
              Владелец системы ещё не добавил планеты.
            </p>
          </div>
        ) : (
          <div className="planet-grid">
            {planets.map((planet) => (
              <article
                className="ui-card planet-card"
                key={planet.id}
              >
                <div
                  className={`planet-marker planet-marker--${planet.planet_type}`}
                  aria-hidden="true"
                >
                  ✦
                </div>

                <h3>{planet.name}</h3>

                <span className="badge badge--muted">
                  {planetTypeLabels[planet.planet_type] ||
                    planet.planet_type}
                </span>

                <span
                  className={`badge ${
                    planet.habitable
                      ? "badge--success"
                      : "badge--danger"
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
                    <dd>
                      {atmosphereLabels[planet.atmosphere] ||
                        planet.atmosphere}
                    </dd>
                  </div>

                  <div>
                    <dt>Вода</dt>
                    <dd>{planet.water ? "Есть" : "Нет"}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default PublicStarSystemPage