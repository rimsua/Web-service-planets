
import React from "react"
import { createRoot } from "react-dom/client"

import "../styles/application.css"
import App from "../App"

const rootElement = document.getElementById("react-root")

if (rootElement) {
  const page = rootElement.dataset.page
  const userNickname = rootElement.dataset.userNickname

  // Данные формы регистрации
  const errors = JSON.parse(rootElement.dataset.errors || "[]")
  const nickname = rootElement.dataset.nickname || ""
  const emailAddress = rootElement.dataset.emailAddress || ""

  // Данные звёздных систем для главной страницы
  const starSystems = JSON.parse(
    rootElement.dataset.starSystems || "[]"
  )

  const starSystemLimit = Number(
    rootElement.dataset.starSystemLimit || 10
  )

  const starTypeLabels = JSON.parse(
    rootElement.dataset.starTypeLabels || "{}"
  )

  const starSystem = JSON.parse(
    rootElement.dataset.starSystem || "null"
  )
  
  const planets = JSON.parse(
    rootElement.dataset.planets || "[]"
  )

  const flashAlert = rootElement.dataset.flashAlert || ""
  const flashNotice = rootElement.dataset.flashNotice || ""

  createRoot(rootElement).render(
    <React.StrictMode>
      <App
        page={page}
        userNickname={userNickname}
        errors={errors}
        nickname={nickname}
        emailAddress={emailAddress}
        starSystems={starSystems}
        starSystemLimit={starSystemLimit}
        starTypeLabels={starTypeLabels}
        starSystem={starSystem}
        planets={planets}
        flashAlert={flashAlert}
        flashNotice={flashNotice}
      />
    </React.StrictMode>
  )
}

function getAuthError(field) {
  const label =
    field.closest(".auth-form__field")?.querySelector("label") ||
    field.parentElement?.querySelector("label")

  const fieldName = label?.textContent.trim() || "Это поле"

  if (field.validity.valueMissing) {
    return `Заполните поле «${fieldName}»`
  }

  if (field.type === "email" && field.validity.typeMismatch) {
    return "Введите корректный адрес электронной почты"
  }

  if (field.validity.tooShort) {
    return `Минимальная длина — ${field.minLength} символов`
  }

  if (field.validity.tooLong) {
    return `Максимальная длина — ${field.maxLength} символов`
  }

  if (field.name === "user[password_confirmation]") {
    const password = field.form.querySelector(
      '[name="user[password]"]'
    )

    if (field.value && password && field.value !== password.value) {
      return "Пароли не совпадают."
    }
  }

  return ""
}

document.addEventListener(
  "submit",
  (event) => {
    const form = event.target

    if (
      !(form instanceof HTMLFormElement) ||
      !form.classList.contains("auth-form")
    ) {
      return
    }

    let firstInvalidField = null

    const fields = form.querySelectorAll(
      'input:not([type="hidden"]):not([type="submit"])'
    )

    fields.forEach((field) => {
      const oldError = field.parentElement.querySelector(
        ".auth-field-error"
      )

      oldError?.remove()

      field.classList.remove("is-invalid")
      field.removeAttribute("aria-invalid")

      const message = getAuthError(field)

      if (!message) return

      if (!firstInvalidField) {
        firstInvalidField = field
      }

      field.classList.add("is-invalid")
      field.setAttribute("aria-invalid", "true")

      const error = document.createElement("span")
      error.className = "auth-field-error"
      error.setAttribute("role", "alert")
      error.textContent = message

      field.insertAdjacentElement("afterend", error)
    })

    if (firstInvalidField) {
      event.preventDefault()
      firstInvalidField.focus()
    }
  },
  true
)

document.addEventListener("input", (event) => {
  const field = event.target

  if (
    !(field instanceof HTMLInputElement) ||
    !field.form?.classList.contains("auth-form")
  ) {
    return
  }

  const error = field.parentElement.querySelector(
    ".auth-field-error"
  )

  if (!error) return

  const message = getAuthError(field)

  if (message) {
    error.textContent = message
  } else {
    error.remove()
    field.classList.remove("is-invalid")
    field.removeAttribute("aria-invalid")
  }
})
