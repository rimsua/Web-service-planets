import SystemScene3D from "../components/SystemScene3D"

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

        {planetCount > 0 && (
          <div className="system-3d-block">
            <p className="eyebrow">3D VIEW</p>

            <h3>Трёхмерная модель системы</h3>

            <p className="text-muted">
              Нажми на планету, чтобы посмотреть её характеристики
            </p>

            <SystemScene3D
              starType={starType}
              planets={planets}
            />
          </div>
        )}
      </section>
    </div>
  )
}

export default PublicStarSystemPage