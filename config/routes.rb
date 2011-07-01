GeoquestEditor::Application.routes.draw do



  get "interconnections/show"

  get "profile/show"

  get "xmleditor/show"

  resources :users
  resource :session
  resource :profile, :only =>  [:show], :controller => :profile
  resources :projects do
    resources :missions
    resource :image_gallery,  :only => [:show], :controller => :image_gallery
    resource :audio_gallery,  :only => [:show], :controller => :audio_gallery
    resource :xmleditor, :only => [:show], :controller => :xmleditor
    resource :interconnections, :only => [:show], :controller => :interconnections
    match 'deploy' => "projects#deploy", :as => 'deploy', :controller => :projects
    match 'delete' => "projects#delete", :as => 'delete', :controller => :projects

    match 'image_gallery/uploadFile' => "image_gallery#uploadFile", :as => "image_gallery/uploadFile"
    match 'audio_gallery/uploadFile' => "audio_gallery#uploadFile", :as => "audio_gallery/uploadFile"
  end


  match '/commands/execute' => "commands#execute", :as => "commands/execute" #Rework as /ajax/execute ?
  match '/ajax/query' => "query#execute", :as => "ajax/query"
  match '/ajax/show_dir' => "query#show_dir", :as => "ajax/show_dir"
  match '/ajax/show_missions' => "query#show_missions", :as => "ajax/show_missions"
  match '/ajax/get_next_mission_id' => "query#get_next_mission_id", :as => "ajax/get_next_mission_id"
  match '/ajax/get_next_hotspot_id' => "query#get_next_hotspot_id", :as => "ajax/get_next_hotspot_id"
  match '/ajax/show_mission_interconnections' => "query#show_mission_interconnections", :as => "ajax/show_mission_interconnections"


  match '/login' => "sessions#new", :as => "login"
  match '/logout' => "sessions#destroy", :as => "logout"

  match '/register' => "users#new", :as => "register"

  match '/repository/:name' => "repository#show"
  match '/repository/:name/gamelist.php' => "repository#gamelist"
  match '/repository/:name/games/:file.zip' => "repository#download"

  root :to => "welcome#index"

end
