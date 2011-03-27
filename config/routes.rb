GeoquestEditor::Application.routes.draw do


  resources :users
  resource :session
  resources :projects do
    resources :missions
  end

  match '/commands/execute' => "commands#execute", :as => "commands/execute"
  match '/hotspots/update' => "hotspots#update", :as => "hotspots/update"
  match '/hotspots/create' => "hotspots#create", :as => "hotspots/create"
  match '/login' => "sessions#new", :as => "login"
  match '/logout' => "sessions#destroy", :as => "logout"

  match '/register' => "users#new", :as => "register"

  root :to => "welcome#index"

end
