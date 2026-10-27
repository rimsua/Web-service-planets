import { useState } from "react"

function StarSystemPage({
  starSystem,
  starTypeLabels = {},
  planets = [],
  flashAlert = "",
  flashNotice = "",
  onSystemDeleted = () => {}
}) {
  const csrfToken =
    document.querySelector('meta[name="csrf-token"]')?.content || ""

  const [visiblePlanets, setVisiblePlanets] = useState(planets)
  const [localFlashAlert, setLocalFlashAlert] = useState(flashAlert)
  const [localFlashNotice, setLocalFlashNotice] = useState(flashNotice)

  const [pendingDeletion, setPendingDeletion] = useState(null)

  const [isEditingSystemName, setIsEditingSystemName] = useState(false)
  const [systemNameDraft, setSystemNameDraft] = useState(
    starSystem?.name || ""
  )

  const [visibleStarSystemName, setVisibleStarSystemName] =
    useState(starSystem?.name || "")

  const [isSavingSystemName, setIsSavingSystemName] =
    useState(false)

  const [isDeletingSystem, setIsDeletingSystem] =
    useState(false)

  const [editingPlanetId, setEditingPlanetId] = useState(null)

  const [planetDraft, setPlanetDraft] = useState({
    name: "",
    planet_type: "rocky",
    temperature: 288,
    atmosphere: "dense",
    water: false
  })

  const [isAddPlanetOpen, setIsAddPlanetOpen] = useState(false)
  const [createMode, setCreateMode] = useState("manual")
  const [isSavingPlanet, setIsSavingPlanet] = useState(false)

  const startEditingPlanet = (planet) => {
    setPlanetDraft({
      name: planet.name,
      planet_type: planet.planet_type,
      temperature: planet.temperature,
      atmosphere: planet.atmosphere,
      water: Boolean(planet.water)
    })

    setEditingPlanetId(planet.id)
    setLocalFlashAlert("")
    setLocalFlashNotice("")
  }

  const updatePlanetDraft = (field, value) => {
    setPlanetDraft((current) => ({
      ...current,
      [field]: value
    }))
  }

  const readResponse = async (response) => {
    try {
      return await response.json()
    } catch {
      return {}
    }
  }

  const getErrorMessage = (data, fallback) => {
    if (Array.isArray(data.errors) && data.errors.length > 0) {
      return data.errors.join(". ")
    }

    return fallback
  }

  const requestHeaders = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-CSRF-Token": csrfToken
  }

  // Переименование звёздной системы без перезагрузки страницы.
  const handleSystemNameSubmit = async (event) => {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)

    const name = String(
      formData.get("star_system[name]") || ""
    ).trim()

    setIsSavingSystemName(true)
    setLocalFlashAlert("")
    setLocalFlashNotice("")

    try {
      const response = await fetch(form.action, {
        method: "PATCH",
        headers: requestHeaders,
        body: JSON.stringify({
          star_system: { name }
        })
      })

      const data = await readResponse(response)

      if (!response.ok) {
        setLocalFlashAlert(
          getErrorMessage(
            data,
            "Не удалось изменить название звёздной системы."
          )
        )
        return
      }

      const savedName = data.name || name

      setVisibleStarSystemName(savedName)
      setSystemNameDraft(savedName)
      setIsEditingSystemName(false)

      setLocalFlashNotice(
        "Название звёздной системы изменено."
      )
    } catch {
      setLocalFlashAlert(
        "Не удалось связаться с сервером. Попробуй ещё раз."
      )
    } finally {
      setIsSavingSystemName(false)
    }
  }

  // Удаление звёздной системы без перезагрузки страницы.
  const handleSystemDelete = async (systemId) => {
    setIsDeletingSystem(true)
    setLocalFlashAlert("")
    setLocalFlashNotice("")

    try {
      const response = await fetch(
        `/star_systems/${systemId}`,
        {
          method: "DELETE",
          headers: requestHeaders
        }
      )

      const data = await readResponse(response)

      if (!response.ok) {
        setLocalFlashAlert(
          getErrorMessage(
            data,
            "Не удалось удалить звёздную систему."
          )
        )
        return
      }

      // Сообщаем компоненту App, что систему удалили.
      // App должен показать каталог звёздных систем.
      onSystemDeleted(data.id ?? systemId)
    } catch {
      setLocalFlashAlert(
        "Не удалось связаться с сервером. Попробуй ещё раз."
      )
    } finally {
      setIsDeletingSystem(false)
    }
  }

  // Создание планеты вручную без перезагрузки страницы.
  const handleManualPlanetSubmit = async (event) => {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)

    const payload = {
      planet: {
        name: formData.get("planet[name]"),
        planet_type: formData.get("planet[planet_type]"),
        temperature: Number(
          formData.get("planet[temperature]")
        ),
        atmosphere: formData.get("planet[atmosphere]"),
        water: formData.get("planet[water]") === "true"
      }
    }

    setIsSavingPlanet(true)
    setLocalFlashAlert("")
    setLocalFlashNotice("")

    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: requestHeaders,
        body: JSON.stringify(payload)
      })

      const data = await readResponse(response)

      if (!response.ok) {
        setLocalFlashAlert(
          getErrorMessage(data, "Не удалось создать планету.")
        )
        return
      }

      setVisiblePlanets((current) => [...current, data])
      setLocalFlashNotice("Планета успешно создана.")
      setIsAddPlanetOpen(false)
      setCreateMode("manual")
      form.reset()
    } catch {
      setLocalFlashAlert(
        "Не удалось связаться с сервером. Попробуй ещё раз."
      )
    } finally {
      setIsSavingPlanet(false)
    }
  }

  // Создание случайной планеты без перезагрузки страницы.
  const handleRandomPlanetSubmit = async (event) => {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)

    const payload = {
      planet: {
        name: formData.get("planet[name]")
      }
    }

    setIsSavingPlanet(true)
    setLocalFlashAlert("")
    setLocalFlashNotice("")

    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: requestHeaders,
        body: JSON.stringify(payload)
      })

      const data = await readResponse(response)

      if (!response.ok) {
        setLocalFlashAlert(
          getErrorMessage(
            data,
            "Не удалось сгенерировать планету."
          )
        )
        return
      }

      setVisiblePlanets((current) => [...current, data])
      setLocalFlashNotice("Случайная планета успешно создана.")
      setIsAddPlanetOpen(false)
      setCreateMode("manual")
      form.reset()
    } catch {
      setLocalFlashAlert(
        "Не удалось связаться с сервером. Попробуй ещё раз."
      )
    } finally {
      setIsSavingPlanet(false)
    }
  }

  // Изменение планеты без перезагрузки страницы.
  const handlePlanetUpdate = async (event, planetId) => {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)

    const payload = {
      planet: {
        name: formData.get("planet[name]"),
        planet_type: formData.get("planet[planet_type]"),
        temperature: Number(
          formData.get("planet[temperature]")
        ),
        atmosphere: formData.get("planet[atmosphere]"),
        water: formData.get("planet[water]") === "true"
      }
    }

    setIsSavingPlanet(true)
    setLocalFlashAlert("")
    setLocalFlashNotice("")

    try {
      const response = await fetch(form.action, {
        method: "PATCH",
        headers: requestHeaders,
        body: JSON.stringify(payload)
      })

      const data = await readResponse(response)

      if (!response.ok) {
        setLocalFlashAlert(
          getErrorMessage(data, "Не удалось изменить планету.")
        )
        return
      }

      setVisiblePlanets((current) =>
        current.map((planet) =>
          planet.id === planetId ? data : planet
        )
      )

      setEditingPlanetId(null)
      setLocalFlashNotice("Параметры планеты изменены.")
    } catch {
      setLocalFlashAlert(
        "Не удалось связаться с сервером. Попробуй ещё раз."
      )
    } finally {
      setIsSavingPlanet(false)
    }
  }

  // Удаление планеты без перезагрузки страницы.
  const handlePlanetDelete = async (planetId) => {
    setLocalFlashAlert("")
    setLocalFlashNotice("")

    try {
      const response = await fetch(
        `/star_systems/${starSystem.id}/planets/${planetId}`,
        {
          method: "DELETE",
          headers: requestHeaders
        }
      )

      const data = await readResponse(response)

      if (!response.ok) {
        setLocalFlashAlert(
          getErrorMessage(data, "Не удалось удалить планету.")
        )
        return
      }

      setVisiblePlanets((current) =>
        current.filter((planet) => planet.id !== planetId)
      )

      setLocalFlashNotice("Планета удалена.")
    } catch {
      setLocalFlashAlert(
        "Не удалось связаться с сервером. Попробуй ещё раз."
      )
    }
  }

  if (!starSystem) {
    return (
      <div className="page system-detail-page">
        <p>Звёздная система не найдена.</p>

        <a href="/star_systems" className="btn btn--secondary">
          Вернуться к звёздным системам
        </a>
      </div>
    )
  }

  const starType = starSystem.star_type || "G"

  const starLabel =
    starTypeLabels[starType] || `Спектральный класс ${starType}`

  const planetCount = visiblePlanets.length

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
              systemId: starSystem.id,
              title: "Удалить звёздную систему?",
              message: `Система «${visibleStarSystemName}» и все её планеты будут удалены. Это действие нельзя отменить.`
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
            disabled={isDeletingSystem}
          >
            {isDeletingSystem ? "Удаление…" : "Удалить систему"}
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
                onSubmit={handleSystemNameSubmit}
              >
                <input
                  type="hidden"
                  name="authenticity_token"
                  value={csrfToken}
                />

                <input
                  type="hidden"
                  name="_method"
                  value="patch"
                />

                <input
                  className="form__input"
                  type="text"
                  name="star_system[name]"
                  value={systemNameDraft}
                  onChange={(event) =>
                    setSystemNameDraft(event.target.value)
                  }
                  maxLength={20}
                  required
                  autoFocus
                  aria-label="Новое название звёздной системы"
                />

                <button
                  className="btn btn--primary btn--small"
                  type="submit"
                  disabled={isSavingSystemName}
                >
                  {isSavingSystemName
                    ? "Сохранение…"
                    : "Сохранить"}
                </button>

                <button
                  className="btn btn--secondary btn--small"
                  type="button"
                  disabled={isSavingSystemName}
                  onClick={() => {
                    setSystemNameDraft(visibleStarSystemName)
                    setIsEditingSystemName(false)
                  }}
                >
                  Отмена
                </button>
              </form>
            ) : (
              <>
                <h1>{visibleStarSystemName}</h1>

                <button
                  className="btn btn--secondary btn--small"
                  type="button"
                  onClick={() => {
                    setSystemNameDraft(visibleStarSystemName)
                    setIsEditingSystemName(true)
                  }}
                  aria-label="Изменить название системы"
                >
                  Изменить имя
                </button>
              </>
            )}
          </div>

          <p className="system-detail-type">{starLabel}</p>
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

          <button
            className="btn btn--primary btn--small planet-add-trigger"
            type="button"
            onClick={() => {
              setCreateMode("manual")
              setIsAddPlanetOpen(true)
              setLocalFlashAlert("")
              setLocalFlashNotice("")
            }}
            aria-label="Добавить планету"
            title="Добавить планету"
          >
            +
          </button>
        </div>
      </section>

      {localFlashNotice && (
        <div className="system-notice" role="status">
          {localFlashNotice}
        </div>
      )}

      {localFlashAlert && (
        <div className="auth-errors" role="alert">
          <p>{localFlashAlert}</p>
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
              Нажми «+» рядом с названием системы, чтобы добавить первую планету.
            </p>
          </div>
        ) : (
          <div className="planet-grid">
            {visiblePlanets.map((planet) => (
              <article
                className="ui-card planet-card"
                key={planet.id}
              >
                <div
                  className={`planet-marker planet-marker--${planet.planet_type}`}
                >
                  ✦
                </div>

                {editingPlanetId === planet.id ? (
                  <form
                    className="system-create-form planet-edit-form"
                    action={`/star_systems/${starSystem.id}/planets/${planet.id}`}
                    method="post"
                    onSubmit={(event) =>
                      handlePlanetUpdate(event, planet.id)
                    }
                  >
                    <input
                      type="hidden"
                      name="authenticity_token"
                      value={csrfToken}
                    />

                    <input
                      type="hidden"
                      name="_method"
                      value="patch"
                    />

                    <div className="system-form__field">
                      <label htmlFor={`planet_name_${planet.id}`}>
                        Название
                      </label>

                      <input
                        id={`planet_name_${planet.id}`}
                        className="form__input"
                        name="planet[name]"
                        type="text"
                        value={planetDraft.name}
                        onChange={(event) =>
                          updatePlanetDraft("name", event.target.value)
                        }
                        maxLength={25}
                        required
                      />
                    </div>

                    <div className="system-form__field">
                      <label htmlFor={`planet_type_${planet.id}`}>
                        Тип планеты
                      </label>

                      <select
                        id={`planet_type_${planet.id}`}
                        name="planet[planet_type]"
                        value={planetDraft.planet_type}
                        onChange={(event) =>
                          updatePlanetDraft(
                            "planet_type",
                            event.target.value
                          )
                        }
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
                      <label htmlFor={`planet_temperature_${planet.id}`}>
                        Температура (Кельвины)
                      </label>

                      <input
                        id={`planet_temperature_${planet.id}`}
                        className="form__input"
                        name="planet[temperature]"
                        type="number"
                        min={0}
                        step={1}
                        value={planetDraft.temperature}
                        onChange={(event) =>
                          updatePlanetDraft(
                            "temperature",
                            event.target.value
                          )
                        }
                        required
                      />
                    </div>

                    <div className="system-form__field">
                      <label htmlFor={`planet_atmosphere_${planet.id}`}>
                        Атмосфера
                      </label>

                      <select
                        id={`planet_atmosphere_${planet.id}`}
                        name="planet[atmosphere]"
                        value={planetDraft.atmosphere}
                        onChange={(event) =>
                          updatePlanetDraft(
                            "atmosphere",
                            event.target.value
                          )
                        }
                        required
                      >
                        <option value="none">Нет</option>
                        <option value="thin">Разреженная</option>
                        <option value="dense">Плотная</option>
                      </select>
                    </div>

                    <div className="system-form__field">
                      <label htmlFor={`planet_water_${planet.id}`}>
                        Наличие воды
                      </label>

                      <select
                        id={`planet_water_${planet.id}`}
                        name="planet[water]"
                        value={planetDraft.water ? "true" : "false"}
                        onChange={(event) =>
                          updatePlanetDraft(
                            "water",
                            event.target.value === "true"
                          )
                        }
                        required
                      >
                        <option value="false">Нет</option>
                        <option value="true">Есть</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="btn btn--primary"
                      disabled={isSavingPlanet}
                    >
                      {isSavingPlanet
                        ? "Сохранение…"
                        : "Сохранить изменения"}
                    </button>

                    <button
                      type="button"
                      className="btn btn--secondary"
                      disabled={isSavingPlanet}
                      onClick={() => setEditingPlanetId(null)}
                    >
                      Отмена
                    </button>
                  </form>
                ) : (
                  <>
                    <div className="entity-title-row">
                      <h3>{planet.name}</h3>

                      <button
                        className="btn btn--secondary btn--small"
                        type="button"
                        onClick={() => startEditingPlanet(planet)}
                        aria-label={`Редактировать планету ${planet.name}`}
                      >
                        Редактировать
                      </button>
                    </div>

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
                  </>
                )}

                <form
                  action={`/star_systems/${starSystem.id}/planets/${planet.id}`}
                  method="post"
                  className="planet-delete-form"
                  onSubmit={(event) => {
                    event.preventDefault()

                    setPendingDeletion({
                      planetId: planet.id,
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

      {isAddPlanetOpen && (
        <div
          className="planet-modal-backdrop"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !isSavingPlanet
            ) {
              setIsAddPlanetOpen(false)
            }
          }}
        >
          <section
            className="planet-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="planet-modal-title"
          >
            <div className="planet-modal__header">
              <div>
                <p className="eyebrow">CREATE PLANET</p>
                <h2 id="planet-modal-title">Добавить планету</h2>
              </div>

              <button
                type="button"
                className="btn btn--secondary btn--small"
                aria-label="Закрыть окно"
                disabled={isSavingPlanet}
                onClick={() => setIsAddPlanetOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="planet-modal__tabs">
              <button
                type="button"
                className={`btn ${
                  createMode === "manual"
                    ? "btn--primary"
                    : "btn--secondary"
                }`}
                disabled={isSavingPlanet}
                onClick={() => setCreateMode("manual")}
              >
                Вручную
              </button>

              <button
                type="button"
                className={`btn ${
                  createMode === "random"
                    ? "btn--primary"
                    : "btn--secondary"
                }`}
                disabled={isSavingPlanet}
                onClick={() => setCreateMode("random")}
              >
                Случайная генерация
              </button>
            </div>

            {createMode === "manual" ? (
              <form
                action={`/star_systems/${starSystem.id}/planets`}
                method="post"
                className="system-create-form planet-create-form"
                onSubmit={handleManualPlanetSubmit}
              >
                <input
                  type="hidden"
                  name="authenticity_token"
                  value={csrfToken}
                />

                <div className="system-form__field">
                  <label htmlFor="new_planet_name">Название</label>

                  <input
                    id="new_planet_name"
                    className="form__input"
                    name="planet[name]"
                    type="text"
                    maxLength={25}
                    required
                  />
                </div>

                <div className="system-form__field">
                  <label htmlFor="new_planet_type">
                    Тип планеты
                  </label>

                  <select
                    id="new_planet_type"
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
                  <label htmlFor="new_planet_temperature">
                    Температура (Кельвины)
                  </label>

                  <input
                    id="new_planet_temperature"
                    className="form__input"
                    name="planet[temperature]"
                    type="number"
                    min={0}
                    step={1}
                    defaultValue={288}
                    required
                  />
                </div>

                <div className="system-form__field">
                  <label htmlFor="new_planet_atmosphere">
                    Атмосфера
                  </label>

                  <select
                    id="new_planet_atmosphere"
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
                  <label htmlFor="new_planet_water">
                    Наличие воды
                  </label>

                  <select
                    id="new_planet_water"
                    name="planet[water]"
                    defaultValue="false"
                    required
                  >
                    <option value="false">Нет</option>
                    <option value="true">Есть</option>
                  </select>
                </div>

                <div className="planet-modal__actions">
                  <button
                    type="submit"
                    className="btn btn--primary"
                    disabled={isSavingPlanet}
                  >
                    {isSavingPlanet
                      ? "Создание…"
                      : "Создать планету"}
                  </button>
                </div>
              </form>
            ) : (
              <form
                action={`/star_systems/${starSystem.id}/planets/generate_random`}
                method="post"
                className="system-create-form planet-create-form"
                onSubmit={handleRandomPlanetSubmit}
              >
                <input
                  type="hidden"
                  name="authenticity_token"
                  value={csrfToken}
                />

                <p className="text-muted">
                  Тип, температура, атмосфера и наличие воды будут выбраны
                  случайным образом.
                </p>

                <div className="system-form__field">
                  <label htmlFor="random_planet_name">
                    Название (необязательно)
                  </label>

                  <input
                    id="random_planet_name"
                    className="form__input"
                    name="planet[name]"
                    type="text"
                    maxLength={25}
                    placeholder="Пустое поле — случайное имя"
                  />
                </div>

                <div className="planet-modal__actions">
                  <button
                    type="submit"
                    className="btn btn--primary"
                    disabled={isSavingPlanet}
                  >
                    {isSavingPlanet
                      ? "Генерация…"
                      : "✦ Сгенерировать планету"}
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      )}

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
                disabled={isDeletingSystem}
                onClick={() => {
                  const deletion = pendingDeletion

                  setPendingDeletion(null)

                  if (deletion.planetId) {
                    handlePlanetDelete(deletion.planetId)
                  } else if (deletion.systemId) {
                    handleSystemDelete(deletion.systemId)
                  }
                }}
              >
                {isDeletingSystem ? "Удаление…" : "Удалить"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

export default StarSystemPage