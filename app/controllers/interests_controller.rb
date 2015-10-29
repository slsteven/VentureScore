class InterestsController < ApplicationController
	def create
		puts current_user
		interests = current_user.interests.new(food: params[:food], culture: params[:culture], religion: params[:religion], health: params[:health], nightlife: params[:nightlife], shopping: params[:shopping], outdoor: params[:outdoor], transportation: params[:transportation])
		puts interests.each

		if interests.save
			puts "added interests"
			redirect_to '/home'
		else
			redirect_to '/index'
		end

	end
end
