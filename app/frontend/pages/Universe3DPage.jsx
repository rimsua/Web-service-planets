import UniverseScene3D from "../components/UniverseScene3D"

function Universe3DPage({ starSystems = [] }) {
  return (
    <div className="page universe-3d-page">
      <section className="section">
        <div className="section__header">
          <div>
            <p className="eyebrow">COMMUNITY UNIVERSE</p>

            <h1>Общая вселенная</h1>

            <p className="universe-intro">
              Исследуй звёздные системы, которыми поделились 
              другие пользователи: каждая светящаяся звезда
              на карте обозначает одну такую систему.
            </p>
          </div>
        </div>

        <div className="universe-3d-panel">
          {starSystems.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">✦</div>

              <h3>Пока нет опубликованных систем</h3>

              <p>
                Когда пользователи опубликуют свои системы,
                они появятся на этой карте.
              </p>
            </div>
          ) : (
            <UniverseScene3D
              starSystems={starSystems}
            />
          )}
        </div>

        <p className="universe-3d-help">
          Наведи курсор на звезду, чтобы узнать о системе.
          Нажми на неё, чтобы открыть систему.
          Перетаскивай мышь для вращения карты.
        </p>

        <p className="text-muted">
          Всего опубликованных систем: {starSystems.length}.
          Расположение на карте условное.
        </p>
      </section>
    </div>
  )
}

export default Universe3DPage