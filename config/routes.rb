Rails.application.routes.draw do
 
  post '/sessions' => 'sessions#create'
  delete '/sessions' => 'sessions#destroy'

  get '/home' => 'users#home'
  post '/users' => 'users#create'
  get '/index' => 'users#index'

  post '/interests' => 'interests#create'
end
