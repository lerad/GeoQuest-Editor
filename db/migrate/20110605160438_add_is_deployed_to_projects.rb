class AddIsDeployedToProjects < ActiveRecord::Migration
  def self.up
    add_column :projects, :is_deployed, :boolean
  end

  def self.down
    remove_column :projects, :is_deployed
  end
end

