Rails.application.routes.draw do
  root'users#home'
 
  post '/sessions' => 'sessions#create'
  delete '/sessions' => 'sessions#destroy'

  post '/users' => 'users#create'
  get '/index' => 'users#index'

  post '/interests' => 'interests#create'
  post '/verify', to: 'users#verify'
  get '/xola', to: 'users#xola'
end
