import Button from "../components/ui/Button"
import Badge from "../components/ui/Badge"
import Card from "../components/ui/Card"
import Input from "../components/ui/Input"

function UiKitPage() {
  return (
    <div className="ui-kit">

      <section className="ui-kit__intro">

        <p className="eyebrow">
          DESIGN SYSTEM
        </p>

        <h1>
          My Universe UI-kit
        </h1>

        <p>
          Основные визуальные компоненты,
          которые будут использоваться
          во всем приложении.
        </p>

      </section>


      <section className="ui-section">

        <div className="ui-section__title">
          <h2>Colors</h2>
        </div>

        <div className="ui-panel">

          <div className="color-grid">

            <div className="color-swatch color-swatch--bg">
              Background
            </div>

            <div className="color-swatch color-swatch--panel">
              Panel
            </div>

            <div className="color-swatch color-swatch--cyan">
              Cyan
            </div>

            <div className="color-swatch color-swatch--violet">
              Violet
            </div>

            <div className="color-swatch color-swatch--text">
              Text
            </div>

          </div>

        </div>

      </section>


      <section className="ui-section">

        <div className="ui-section__title">
          <h2>Typography</h2>
        </div>

        <div className="ui-panel">

          <p className="eyebrow">
            Eyebrow
          </p>

          <h1>
            Заголовок H1
          </h1>

          <h2>
            Заголовок H2
          </h2>

          <h3>
            Заголовок H3
          </h3>

          <p>
            Основной текст интерфейса.
            Здесь будет находиться описание
            звездных систем, планет и действий
            пользователя.
          </p>

          <p className="text-muted">
            Дополнительный вторичный текст.
          </p>

        </div>

      </section>


      <section className="ui-section">

        <div className="ui-section__title">
          <h2>Buttons</h2>
        </div>

        <div className="ui-panel">

          <div className="ui-button-row">

            <Button>
              Primary
            </Button>

            <Button variant="secondary">
              Secondary
            </Button>

            <Button variant="ghost">
              Ghost
            </Button>

            <Button disabled>
              Disabled
            </Button>

          </div>

        </div>

      </section>


      <section className="ui-section">

        <div className="ui-section__title">
          <h2>Forms</h2>
        </div>

        <div className="ui-panel">

          <div className="form">

            <Input
              label="Название звездной системы"
              placeholder="Например, Aurora"
            />

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
            />

          </div>

        </div>

      </section>


      <section className="ui-section">

        <div className="ui-section__title">
          <h2>Badges</h2>
        </div>

        <div className="ui-panel">

          <div className="ui-button-row">

            <Badge>
              Скоро доступно
            </Badge>

            <span className="badge badge--success">
              Активно
            </span>

            <span className="badge badge--danger">
              Ошибка
            </span>

          </div>

        </div>

      </section>


      <section className="ui-section">

        <div className="ui-section__title">
          <h2>Cards</h2>
        </div>

        <div className="ui-card-grid">

          <Card
            icon="✦"
            title="Звездная система"
            description="Будущий контейнер для звезд и планет."
          />

          <Card
            icon="◉"
            title="Планета"
            description="Будущий объект с параметрами и 3D-представлением."
          />

          <Card
            icon="◇"
            title="Генерация"
            description="Будущий компонент случайной генерации планеты."
          />

        </div>

      </section>


      <section className="ui-section">

        <div className="ui-section__title">
          <h2>Empty state</h2>
        </div>

        <div className="empty-state">

          <div className="empty-state__icon">
            ✦
          </div>

          <h3>
            Здесь пока пусто
          </h3>

          <p>
            Это стандартное состояние,
            когда у пользователя еще нет объектов.
          </p>

          <Button disabled>
            Основное действие
          </Button>

        </div>

      </section>

    </div>
  )
}

export default UiKitPage