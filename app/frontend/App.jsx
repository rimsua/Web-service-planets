
import AppShell from "./components/AppShell"
import HomePage from "./pages/HomePage"
import UiKitPage from "./pages/UiKitPage"
import SignUpPage from "./pages/SignUpPage"

function App({
  page,
  userNickname,
  errors = [],
  nickname = "",
  emailAddress = "",
  starSystems = [],
  starSystemLimit = 10,
  starTypeLabels = {},
  flashAlert = "",
  flashNotice = ""
}) {
  if (page === "sign-up") {
    return (
      <SignUpPage
        errors={errors}
        nickname={nickname}
        emailAddress={emailAddress}
      />
    )
  }

  let content

  switch (page) {
    case "ui-kit":
      content = <UiKitPage />
      break

    case "home":
    default:
      content = (
        <HomePage
          userNickname={userNickname}
          starSystems={starSystems}
          starSystemLimit={starSystemLimit}
          starTypeLabels={starTypeLabels}
          flashAlert={flashAlert}
          flashNotice={flashNotice}
        />
      )
      break
  }

  return (
    <AppShell userNickname={userNickname}>
      {content}
    </AppShell>
  )
}

export default App
