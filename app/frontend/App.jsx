import { useState } from "react"

import AppShell from "./components/AppShell"
import HomePage from "./pages/HomePage"
import UiKitPage from "./pages/UiKitPage"
import SignUpPage from "./pages/SignUpPage"
import StarSystemPage from "./pages/StarSystemPage"
import StarSystemsPage from "./pages/StarSystemsPage"

function App({
  page,
  userNickname,
  errors = [],
  nickname = "",
  emailAddress = "",
  starSystems = [],
  starSystemLimit = 10,
  starTypeLabels = {},
  starSystem = null,
  planets = [],
  flashAlert = "",
  flashNotice = ""
}) {
  const [activePage, setActivePage] = useState(page)
  const [currentStarSystems, setCurrentStarSystems] =
    useState(starSystems)

  const handleSystemDeleted = (deletedId) => {
    setCurrentStarSystems((current) =>
      current.filter((system) => system.id !== deletedId)
    )

    setActivePage("star-systems")

    // Меняем адрес без полной перезагрузки документа.
    window.history.replaceState({}, "", "/star_systems")
  }

  if (activePage === "sign-up") {
    return (
      <SignUpPage
        errors={errors}
        nickname={nickname}
        emailAddress={emailAddress}
      />
    )
  }

  let content

  switch (activePage) {
    case "ui-kit":
      content = <UiKitPage />
      break

    case "star-systems":
      content = (
        <StarSystemsPage
          userNickname={userNickname}
          starSystems={currentStarSystems}
          starSystemLimit={starSystemLimit}
          starTypeLabels={starTypeLabels}
          flashAlert={flashAlert}
          flashNotice={flashNotice}
        />
      )
      break

    case "star-system":
      content = (
        <StarSystemPage
          starSystem={starSystem}
          starTypeLabels={starTypeLabels}
          planets={planets}
          flashAlert={flashAlert}
          flashNotice={flashNotice}
          onSystemDeleted={handleSystemDeleted}
        />
      )
      break

    case "home":
    default:
      content = (
        <HomePage
          userNickname={userNickname}
          starSystems={currentStarSystems}
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