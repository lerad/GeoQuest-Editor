GeoquestEditor::Application.routes.draw do


  resources :users
  resource :session
  resources :projects do
    resources :missions
    resource :image_gallery,  :only => [:show], :controller => :image_gallery
    #match '/uploadFile' => "image_gallery#uploadFile", :as => "/uploadFile"
  end

  match '/commands/execute' => "commands#execute", :as => "commands/execute" #Rework as /ajax/execute ?
  match '/ajax/query' => "query#execute", :as => "ajax/query"
  match '/ajax/show_dir' => "query#show_dir", :as => "ajax/show_dir"

  match '/login' => "sessions#new", :as => "login"
  match '/logout' => "sessions#destroy", :as => "logout"

  match '/register' => "users#new", :as => "register"

  root :to => "welcome#index"

end
