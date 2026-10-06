import Button from "../components/ui/Button"
import Badge from "../components/ui/Badge"
import Card from "../components/ui/Card"

function HomePage({ userNickname }) {
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

            <Button disabled>
              ✦ Создать звездную систему
            </Button>

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
            <p className="eyebrow">
              YOUR UNIVERSE
            </p>

            <h2>
              Мои звездные системы
            </h2>
          </div>

          <Badge>
            0 / 10
          </Badge>

        </div>


        <div className="empty-state">

          <div className="empty-state__icon">
            ✦
          </div>

          <h3>
            Здесь пока пусто
          </h3>

          <p>
            У тебя пока нет звездных систем.
            Создай первую систему.
          </p>

          <Button disabled>
            Создать первую систему
          </Button>

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