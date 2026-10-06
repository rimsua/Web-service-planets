function AppShell({ userNickname, children }) {
  const csrfToken =
    document.querySelector('meta[name="csrf-token"]')?.content

  return (
    <div className="app-shell">

      <header className="topbar">

        <a href="/" className="brand">
          <span className="brand__mark">✦</span>
          <span className="brand__text">
            My Universe
          </span>
        </a>


        <nav className="topbar__nav">
          <a href="/" className="nav-link">
            Главная
          </a>

          <a href="/ui-kit" className="nav-link">
            UI-kit
          </a>
        </nav>


        <div className="topbar__user">

          <div className="user-avatar">
            {userNickname?.charAt(0).toUpperCase()}
          </div>

          <span className="user-name">
            {userNickname}
          </span>

          <form
            action="/session"
            method="post"
          >
            <input
              type="hidden"
              name="authenticity_token"
              value={csrfToken || ""}
            />

            <input
              type="hidden"
              name="_method"
              value="delete"
            />

            <button
              type="submit"
              className="btn btn--ghost btn--small"
            >
              Выйти
            </button>
          </form>

        </div>

      </header>


      <main className="main-content">
        {children}
      </main>

    </div>
  )
}

export default AppShell