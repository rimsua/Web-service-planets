function getPlanetWord(count) {
  if (count === 1) return "планета"

  if (count >= 2 && count <= 4) {
    return "планеты"
  }

  return "планет"
}

function UniversePage({ starSystems = [] }) {
  return (
    <div className="page universe-page">
      <section className="section">
        <div className="section__header">
          <div>
            <p className="eyebrow">COMMUNITY UNIVERSE</p>

            <h1>Общая вселенная</h1>

            <p className="universe-intro">
              Исследуй звёздные системы, которыми другие пользователи
              поделились с сообществом.
            </p>
          </div>

          <span className="badge badge--muted">
            {starSystems.length} систем
          </span>

          <a
            href="/universe/3d-preview"
            className="btn btn--secondary"
          >
            Посмотреть 3D-сцену
          </a>
        </div>

        {starSystems.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">✦</div>

            <h3>Вселенная пока пуста</h3>

            <p>
              Здесь появятся системы, владельцы которых разрешили
              другим пользователям их просматривать.
            </p>
          </div>
        ) : (
          <div className="universe-grid">
            {starSystems.map((system) => (
              <a
                href={`/universe/${system.id}`}
                className="universe-system-card-link"
                key={system.id}
                aria-label={`Открыть звёздную систему ${system.name}`}
              >
                <article className="ui-card universe-system-card">
                  <div className="universe-star" aria-hidden="true">
                    {system.star_type}
                  </div>

                  <div className="universe-system-card__content">
                    <p className="eyebrow">
                      SPECTRAL CLASS {system.star_type}
                    </p>

                    <h2>{system.name}</h2>

                    <p>
                      Автор: {system.owner_nickname}
                    </p>

                    <span className="badge badge--muted">
                      {system.planet_count}{" "}
                      {getPlanetWord(system.planet_count)}
                    </span>
                  </div>
                </article>
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default UniversePage