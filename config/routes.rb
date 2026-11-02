Rails.application.routes.draw do
  mount ActionCable.server => "/cable"

  resource :session, only: [ :new, :create, :destroy ]
  resource :sign_up, only: [ :show, :create ]
  resources :star_systems, only: [ :index, :create, :show, :update, :destroy ] do
    member do
      patch :publish
      patch :unpublish
    end

    resources :planets, only: [ :create, :update, :destroy ] do
      collection do
        post :generate_random
      end
    end
  end

  get "universe/3d-preview", to: redirect("/universe")
  get "universe", to: "universe#index", as: :universe
  get "universe/:id",
      to: "universe#show",
      as: :universe_star_system
  get "ui-kit", to: "ui_kit#index", as: :ui_kit
  get "up" => "rails/health#show", as: :rails_health_check

  root "home#index"
end
