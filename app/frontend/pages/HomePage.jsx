import Badge from "../components/ui/Badge"
import Card from "../components/ui/Card"

function HomePage({
  userNickname,
  starSystems = [],
  starSystemLimit = 10,
  starTypeLabels = {},
  flashAlert = "",
  flashNotice = ""
}) {
  const csrfToken =
  document.querySelector('meta[name="csrf-token"]')?.content || ""

  return (
    <div className="page">

      <section className="hero">

        <div className="hero__content">

          <p className="eyebrow">
            PERSONAL UNIVERSE
          </p>

          <div className="auth-status auth-status--logged">
            <span className="auth-status__dot" />
            Вы вошли как {userNickname}
          </div>

          <h1 className="hero__title">
            Твоя собственная
            <span>вселенная</span>
          </h1>

          <p className="hero__description">
            Привет, {userNickname}.
            Создавай звездные системы,
            добавляй планеты и исследуй
            их параметры в собственной вселенной.
          </p>

          <div className="hero__actions">

            <a href="#create-star-system" className="btn btn--primary">
              ✦ Создать звёздную систему
            </a>

            <a
              href="/ui-kit"
              className="btn btn--secondary"
            >
              Посмотреть UI-kit
            </a>

          </div>

        </div>


        <div
          className="hero__visual"
          aria-hidden="true"
        >

          <div className="planet planet--large" />

          <div className="planet planet--small" />

          <div className="orbit orbit--one" />
          <div className="orbit orbit--two" />
          <div className="orbit orbit--three" />

          <span className="star star--one">✦</span>
          <span className="star star--two">✦</span>
          <span className="star star--three">✦</span>
          <span className="star star--four">✦</span>

        </div>

      </section>


      <section className="section">
        <div className="section__header">
          <div>
            <p className="eyebrow">YOUR UNIVERSE</p>
            <h2>Мои звёздные системы</h2>
          </div>

          <Badge>
            {starSystems.length} / {starSystemLimit}
          </Badge>
        </div>

        {flashAlert && (
          <div className="auth-errors" role="alert">
            <p>{flashAlert}</p>
          </div>
        )}

        {flashNotice && (
          <div className="system-notice" role="status">
            {flashNotice}
          </div>
        )}

        <div className="system-workspace">
          <div className="system-create-panel" id="create-star-system">
            <p className="eyebrow">NEW SYSTEM</p>
            <h3>Создать звёздную систему</h3>

            {starSystems.length >= starSystemLimit ? (
              <p className="text-muted">
                Ты достигла лимита в {starSystemLimit} систем.
              </p>
            ) : (
              <form
                action="/star_systems"
                method="post"
                className="system-create-form"
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

                <button type="submit" className="btn btn--primary">
                  Создать систему
                </button>
              </form>
            )}
          </div>

          <div className="system-list">
            {starSystems.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state__icon">✦</div>
                <h3>Здесь пока пусто</h3>
                <p>
                  Создай первую звёздную систему и выбери для неё звезду.
                </p>
              </div>
            ) : (
              <div className="system-grid">
                {starSystems.map((system) => (
                  <article className="ui-card system-card" key={system.id}>
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
                      {starTypeLabels[system.star_type]}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>


      <section className="section">

        <div className="section__header">

          <div>
            <p className="eyebrow">
              HOW IT WORKS
            </p>

            <h2>
              Как будет работать My Universe
            </h2>
          </div>

        </div>


        <div className="feature-grid">

          <Card
            icon="✦"
            title="Создай систему"
            description="Создай звездную систему и дай ей собственное имя."
          />

          <Card
            icon="◉"
            title="Добавь планеты"
            description="Создавай планеты вручную или генерируй их случайно."
          />

          <Card
            icon="◇"
            title="Исследуй"
            description="Изучай параметры планет и наблюдай за своей вселенной."
          />

        </div>

      </section>

    </div>
  )
}

export default HomePage