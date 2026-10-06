import Button from "../components/ui/Button"
import Badge from "../components/ui/Badge"
import Input from "../components/ui/Input"

function UiKitPage() {
  return (
    <div className="ui-kit">

      {/* INTRO */}

      <section className="ui-kit__intro">
        
        <h1>
          UI-kit
        </h1>

      </section>


      {/* COLORS */}

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


          <div className="cosmic-background-swatch">

            <div className="cosmic-background-swatch__content">
              <span>
                COSMIC BACKGROUND
              </span>

              <strong>
                My Universe
              </strong>

              <p>
                Основной фон приложения c туманностями
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* TYPOGRAPHY */}

      <section className="ui-section">

        <div className="ui-section__title">
          <h2>Typography</h2>
        </div>

        <div className="ui-panel">

          <h1>
            Заголовок первого уровня
          </h1>

          <h2>
            Заголовок второго уровня
          </h2>

          <h3>
            Название планеты
          </h3>

          <p>
            Основной текст интерфейса.
            Например, описание звездной системы
            или характеристики планеты
          </p>

          <p className="text-muted">
            Вторичный текст используется
            для дополнительной информации
          </p>

        </div>

      </section>


      {/* BUTTONS */}

      <section className="ui-section">

        <div className="ui-section__title">
          <h2>Buttons</h2>
        </div>

        <div className="ui-panel">

          <p className="ui-demo-label">
            Основные действия
          </p>

          <div className="ui-button-row">

            <Button>
              Создать систему
            </Button>

            <Button variant="secondary">
              Добавить планету
            </Button>

            <Button variant="ghost">
              Сгенерировать планету
            </Button>

          </div>


          <p className="ui-demo-label">
            Дополнительные состояния
          </p>

          <div className="ui-button-row">

            <Button variant="secondary">
              Отмена
            </Button>

            <button className="btn btn--danger">
              Удалить планету
            </button>

            <Button disabled>
              Недоступно
            </Button>

          </div>

        </div>

      </section>


      {/* FORMS */}

      <section className="ui-section">

        <div className="ui-section__title">
          <h2>Forms</h2>
        </div>

        <div className="ui-panel">

          <p className="ui-demo-label">
            Создание звездной системы
          </p>

          <div className="form">

            <Input
              label="Название звездной системы"
              placeholder="Например, Balda"
            />

          </div>


          <p className="ui-demo-label">
            Создание планеты
          </p>

          <div className="ui-form-grid">

            <Input
              label="Название планеты"
              placeholder="Например, Terra"
            />


            <div className="form__group">

              <label className="form__label">
                Тип планеты
              </label>

              <select className="form__input">
                <option>Rocky</option>
                <option>Gas</option>
                <option>Ice</option>
                <option>Ocean</option>
                <option>Lava</option>
              </select>

            </div>


            <div className="form__group">

              <label className="form__label">
                Температура, K
              </label>

              <input
                className="form__input"
                type="number"
                placeholder="Например, 288"
              />

            </div>


            <div className="form__group">

              <label className="form__label">
                Атмосфера
              </label>

              <select className="form__input">
                <option>None</option>
                <option>Thin</option>
                <option>Dense</option>
              </select>

            </div>

          </div>


          <div className="form__group ui-checkbox-group">

            <label className="ui-checkbox">

              <input
                type="checkbox"
              />

              <span>
                На планете есть вода
              </span>

            </label>

          </div>


          <p className="ui-demo-label">
            Состояния полей
          </p>

          <div className="ui-form-grid">

            <div className="form__group">

              <label className="form__label">
                Ошибка
              </label>

              <input
                className="form__input form__input--error"
                value="Название"
                readOnly
              />

              <span className="form__error">
                Такое название уже существует
              </span>

            </div>


            <div className="form__group">

              <label className="form__label">
                Недоступное поле
              </label>

              <input
                className="form__input"
                value="Генерируется автоматически"
                disabled
                readOnly
              />

            </div>

          </div>

        </div>

      </section>


      {/* BADGES */}

      <section className="ui-section">

        <div className="ui-section__title">
          <h2>Badges</h2>
        </div>

        <div className="ui-panel">

          <p className="ui-demo-label">
            Типы планет
          </p>

          <div className="ui-button-row">

            <span className="badge badge--muted">
              Rocky
            </span>

            <span className="badge badge--muted">
              Gas
            </span>

            <span className="badge badge--muted">
              Ice
            </span>

            <span className="badge badge--muted">
              Ocean
            </span>

            <span className="badge badge--muted">
              Lava
            </span>

          </div>


          <p className="ui-demo-label">
            Состояния
          </p>

          <div className="ui-button-row">

            <Badge>
              Активна
            </Badge>

            <span className="badge badge--success">
              Пригодна для жизни
            </span>

            <span className="badge badge--danger">
              Ошибка
            </span>

          </div>

        </div>

      </section>


      {/* CARDS */}

      <section className="ui-section">

        <div className="ui-section__title">
          <h2>Cards</h2>
        </div>


        <div className="ui-entity-grid">

          {/* Star system */}

          <article className="ui-entity-card">

            <div className="ui-entity-card__icon">
              ✦
            </div>

            <div className="ui-entity-card__header">

              <div>
                <p className="ui-card__eyebrow">
                  ЗВЕЗДНАЯ СИСТЕМА
                </p>

                <h3>
                  Aurora
                </h3>
              </div>

              <span className="badge badge--success">
                3 планеты
              </span>

            </div>

            <p className="ui-entity-card__description">
              Система пользователя
              с несколькими созданными планетами.
            </p>

            <div className="ui-entity-card__actions">

              <Button variant="secondary">
                Открыть
              </Button>

              <button className="btn btn--danger btn--small">
                Удалить
              </button>

            </div>

          </article>


          {/* Planet */}

          <article className="ui-entity-card">

            <div className="ui-entity-card__icon">
              ◉
            </div>

            <div className="ui-entity-card__header">

              <div>
                <p className="ui-card__eyebrow">
                  ПЛАНЕТА
                </p>

                <h3>
                  Terra
                </h3>
              </div>

              <span className="badge badge--muted">
                Rocky
              </span>

            </div>


            <div className="ui-property-list">

              <div>
                <span>
                  Температура
                </span>

                <strong>
                  288 K
                </strong>
              </div>

              <div>
                <span>
                  Атмосфера
                </span>

                <strong>
                  Dense
                </strong>
              </div>

              <div>
                <span>
                  Вода
                </span>

                <strong>
                  Да
                </strong>
              </div>

            </div>


            <div className="ui-entity-card__actions">

              <Button variant="secondary">
                Подробнее
              </Button>

              <button className="btn btn--danger btn--small">
                Удалить
              </button>

            </div>

          </article>

        </div>

      </section>


      {/* EMPTY STATE */}

      <section className="ui-section">

        <div className="ui-section__title">
          <h2>Empty state</h2>
        </div>

        <div className="empty-state">

          <div className="empty-state__icon">
            ✦
          </div>

          <h3>
            В этой системе пока нет планет
          </h3>

          <p>
            Добавьте планету вручную
            или создайте случайно сгенерированную.
          </p>

          <div className="ui-button-row">

            <Button>
              Добавить планету
            </Button>

            <Button variant="ghost">
              Сгенерировать планету
            </Button>

          </div>

        </div>

      </section>

    </div>
  )
}

export default UiKitPage