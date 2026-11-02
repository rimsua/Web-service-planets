import { useEffect, useState } from "react"

import AppShell from "./components/AppShell"
import HomePage from "./pages/HomePage"
import UiKitPage from "./pages/UiKitPage"
import SignUpPage from "./pages/SignUpPage"
import StarSystemPage from "./pages/StarSystemPage"
import StarSystemsPage from "./pages/StarSystemsPage"
import PublicStarSystemPage from "./pages/PublicStarSystemPage"
import Universe3DPage from "./pages/Universe3DPage"
import consumer from "./channels/consumer"

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

  useEffect(() => {
    // Подключаемся только на страницах общей вселенной
    if (
      activePage !== "universe" &&
      activePage !== "universe-3d"
    ) {
      return
    }

    let isActive = true

    // Обновление списка при подключении и переподключении
    const refreshSystems = async () => {
      try {
        const response = await fetch("/universe.json", {
          headers: {
            Accept: "application/json"
          }
        })

        if (!response.ok) {
          throw new Error("Не удалось обновить список систем.")
        }

        const data = await response.json()

        if (isActive) {
          setCurrentStarSystems(data)
        }
      } catch (error) {
        console.error(
          "Ошибка обновления общей вселенной:",
          error
        )
      }
    }

    const subscription = consumer.subscriptions.create(
      {
        channel: "UniverseChannel"
      },
      {
        connected() {
          refreshSystems()
        },

        received(data) {
          // Добавление или обновление публичной системы.
          if (data.type === "upsert" && data.system) {
            setCurrentStarSystems((current) => {
              const exists = current.some(
                (system) => system.id === data.system.id
              )

              if (exists) {
                return current.map((system) =>
                  system.id === data.system.id
                    ? data.system
                    : system
                )
              }

              return [data.system, ...current]
            })
          }

          // Удаление системы из общей вселенной.
          if (data.type === "remove") {
            setCurrentStarSystems((current) =>
              current.filter(
                (system) => system.id !== data.id
              )
            )
          }
        }
      }
    )

    return () => {
      isActive = false
      subscription.unsubscribe()
    }
  }, [activePage])

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

    case "universe":
    case "universe-3d":
      content = (
        <Universe3DPage
          starSystems={currentStarSystems}
        />
      )
      break

    case "public-star-system":
      content = (
        <PublicStarSystemPage
          starSystem={starSystem}
          starTypeLabels={starTypeLabels}
          planets={planets}
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