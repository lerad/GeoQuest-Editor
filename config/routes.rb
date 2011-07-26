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
  match '/ajax/get_next_event_id' => "query#get_next_event_id", :as => "ajax/get_next_event_id"
  match '/ajax/show_mission_interconnections' => "query#show_mission_interconnections", :as => "ajax/show_mission_interconnections"
  match '/ajax/show_images' => "query#show_images", :as => "ajax/show_images"
  match '/ajax/show_audio' => "query#show_audio", :as => "ajax/show_audio"
  match '/ajax/show_mission_types' => "query#show_mission_types", :as => "ajax/show_mission_types"

  match '/ajax/is_image_used' => "query#is_image_used", :as => "ajax/is_image_used"
  match '/ajax/is_audio_used' => "query#is_audio_used", :as => "ajax/is_audio_used"


  match '/login' => "sessions#new", :as => "login"
  match '/logout' => "sessions#destroy", :as => "logout"

  match '/register' => "users#new", :as => "register"

  match '/repositories/repolist.php' => "repository#repolist"
  match '/repositories/:name' => "repository#show"
  match '/repositories/:name/gamelist.php' => "repository#gamelist"
  match '/repositories/:name/games/:file.zip' => "repository#download"

  root :to => "welcome#index"

end
