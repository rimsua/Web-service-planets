import AppShell from "./components/AppShell"
import HomePage from "./pages/HomePage"
import UiKitPage from "./pages/UiKitPage"

function App({ page, userNickname }) {
  let content

  switch (page) {
    case "ui-kit":
      content = <UiKitPage />
      break

    case "home":
    default:
      content = <HomePage userNickname={userNickname} />
      break
  }

  return (
    <AppShell userNickname={userNickname}>
      {content}
    </AppShell>
  )
}

export default App