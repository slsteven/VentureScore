class EditInterestTable < ActiveRecord::Migration
  def change
  	add_column :interests, :food, :integer
  	add_column :interests, :culture, :integer
  	add_column :interests, :religion, :integer
	add_column :interests, :health, :integer
	add_column :interests, :nightlife, :integer
	add_column :interests, :shopping, :integer
	add_column :interests, :outdoor, :integer
	add_column :interests, :transportation, :integer
  end
end
