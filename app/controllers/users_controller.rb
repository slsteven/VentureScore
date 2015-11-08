class UsersController < ApplicationController
	skip_before_filter :verify_authenticity_token

	def home
	end

	def create
		user = User.new(user_params)
		# user = User.create(name: params[:Name], email: params[:Email], password: params[:password], password: params[:password_confirmation])
		if user.save
			flash[:success] = "User created"
			last_user = User.last
			log_in user
		# redirect_to "/users/#{last_user.id}"
			redirect_to '/home'
		else
			flash[:errors] = user.errors.full_messages
			redirect_to '/home'
		end
	end

	def verify
		HTTParty.get(params[:apiUrl], headers: {'Authorization' => params[:authHeader]})
		head :ok
	end

	private
	def user_params
		params.require(:user).permit(:name, :email, :password, :password_confirmation)
	end
end
