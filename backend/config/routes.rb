Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      post "auth/login", to: "auth#login"
      get "auth/me", to: "auth#me"

      get "dashboard/stats", to: "dashboard#stats"

      resources :products, only: %i[index create update destroy]
      resource :settings, only: %i[show update]

      resources :orders, only: %i[index create] do
        member do
          patch :status, action: :update_status
        end
      end
    end
  end
end
