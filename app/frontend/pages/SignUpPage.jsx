
function SignUpPage({ errors = [], nickname = "", emailAddress = "" }) {
  const csrfToken =
    document.querySelector('meta[name="csrf-token"]')?.content || ""

  return (
    <main className="auth-page">
      <section className="auth-card">
        <a href="/" className="auth-brand">
          <span className="brand__mark">✦</span>
          <span>My Universe</span>
        </a>

        <p className="eyebrow">YOUR UNIVERSE STARTS HERE</p>

        {errors.length > 0 && (
          <div className="auth-errors" role="alert">
            <p>Не удалось создать аккаунт. Проверь данные:</p>
            <ul>
              {errors.map((error, index) => (
                <li key={`${error}-${index}`}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <form
          action="/sign_up"
          method="post"
          className="auth-form"
          noValidate
        >
          <input
            type="hidden"
            name="authenticity_token"
            value={csrfToken}
          />

          <div className="auth-form__field">
            <label htmlFor="user_nickname">Никнейм</label>

            <input
              id="user_nickname"
              name="user[nickname]"
              type="text"
              className="auth-form__input"
              defaultValue={nickname}
              minLength={5}
              maxLength={10}
              required
              autoFocus
              autoComplete="nickname"
              placeholder="Например, qwerty"
            />
          </div>

          <div className="auth-form__field">
            <label htmlFor="user_email_address">
              Электронная почта
            </label>

            <input
              id="user_email_address"
              name="user[email_address]"
              type="email"
              className="auth-form__input"
              defaultValue={emailAddress}
              required
              autoComplete="email"
              placeholder="example@mail.com"
            />
          </div>

          <div className="auth-form__field">
            <label htmlFor="user_password">Пароль</label>

            <input
              id="user_password"
              name="user[password]"
              type="password"
              className="auth-form__input"
              minLength={6}
              maxLength={15}
              required
              autoComplete="new-password"
              placeholder="Введите пароль"
            />

          </div>

          <div className="auth-form__field">
            <label htmlFor="user_password_confirmation">
              Повторите пароль
            </label>

            <input
              id="user_password_confirmation"
              name="user[password_confirmation]"
              type="password"
              className="auth-form__input"
              minLength={6}
              maxLength={15}
              required
              autoComplete="new-password"
              placeholder="Введите пароль ещё раз"
            />
          </div>

          <button
            type="submit"
            className="btn btn--primary auth-form__submit"
          >
            Создать аккаунт
            <span aria-hidden="true"> →</span>
          </button>
        </form>

        <p className="auth-switch">
          Уже есть аккаунт?{" "}
          <a href="/session/new">Войти</a>
        </p>

        <p className="auth-footnote">
          ✦ Твоя вселенная начинается здесь
        </p>
      </section>
    </main>
  )
}

export default SignUpPage
