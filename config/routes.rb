GeoquestEditor::Application.routes.draw do



  resources :users
  resource :session
  resources :projects do
    resources :missions
    resource :image_gallery,  :only => [:show], :controller => :image_gallery
    resource :audio_gallery,  :only => [:show], :controller => :audio_gallery
    match 'image_gallery/uploadFile' => "image_gallery#uploadFile", :as => "image_gallery/uploadFile"
    match 'audio_gallery/uploadFile' => "audio_gallery#uploadFile", :as => "audio_gallery/uploadFile"
  end

  match '/commands/execute' => "commands#execute", :as => "commands/execute" #Rework as /ajax/execute ?
  match '/ajax/query' => "query#execute", :as => "ajax/query"
  match '/ajax/show_dir' => "query#show_dir", :as => "ajax/show_dir"

  match '/login' => "sessions#new", :as => "login"
  match '/logout' => "sessions#destroy", :as => "logout"

  match '/register' => "users#new", :as => "register"

  root :to => "welcome#index"

end
