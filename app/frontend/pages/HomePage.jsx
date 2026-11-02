import Card from "../components/ui/Card"

function HomePage({ userNickname }) {

  return (
    <div className="page">

      <section className="hero">

        <div className="hero__content">

          <p className="eyebrow">
            YOUR SPACE
          </p>

          <div className="auth-status auth-status--logged">
            <span className="auth-status__dot" />
            Вы вошли как {userNickname}
          </div>

          <h1 className="hero__title">
            Твоя
            <span>вселенная</span>
          </h1>

          <p className="hero__description">
            Привет, {userNickname}.
            Твоя история начинается с собственной звёздной системы.
            Но исследовать можно гораздо больше
          </p>

          <div className="home-universe-grid">
            <a
              href="/star_systems"
              className="home-universe-card home-universe-card--personal"
              aria-label="Перейти к моим звёздным системам"
            >
              <div className="home-universe-card__heading">
                <span
                  className="home-universe-card__icon"
                  aria-hidden="true"
                >
                  ✦
                </span>

                <h2>Мои звёздные системы</h2>
              </div>

              <p>
                Создавай собственные звёздные системы,
                добавляй планеты и управляй ими
              </p>

              <span className="home-universe-card__action">
                Перейти
              </span>
            </a>

            {/* Общая вселенная */}
            <a
              href="/universe"
              className="home-universe-card home-universe-card--community"
              aria-label="Перейти в общую вселенную"
            >
              <div className="home-universe-card__heading">
                <span
                  className="home-universe-card__icon"
                  aria-hidden="true"
                >
                  ◈
                </span>

                <h2>Общая вселенная</h2>
              </div>

              <p>
                Исследуй звёздные системы других пользователей
                на интерактивной 3D-карте
              </p>

              <span className="home-universe-card__action">
                Исследовать
              </span>
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

          {/* Передние части колец */}
          <div className="orbit orbit--one orbit--front" />
          <div className="orbit orbit--two orbit--front" />
          <div className="orbit orbit--three orbit--front" />

          <span className="star star--one">✦</span>
          <span className="star star--two">✦</span>
          <span className="star star--three">✦</span>
          <span className="star star--four">✦</span>

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