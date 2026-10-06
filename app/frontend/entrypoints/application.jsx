import React from "react"
import { createRoot } from "react-dom/client"

import "../styles/application.css"

import App from "../App"

const rootElement = document.getElementById("react-root")

if (rootElement) {
  const page = rootElement.dataset.page
  const userNickname = rootElement.dataset.userNickname

  createRoot(rootElement).render(
    <React.StrictMode>
      <App
        page={page}
        userNickname={userNickname}
      />
    </React.StrictMode>
  )
}