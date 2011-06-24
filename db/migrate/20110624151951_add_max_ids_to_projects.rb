class AddMaxIdsToProjects < ActiveRecord::Migration
  def self.up
    add_column :projects, :max_mission_id, :integer, :default => 0
    add_column :projects, :max_hotspot_id, :integer, :default => 0
  end

  def self.down
    remove_column :projects, :max_mission_id
    remove_column :projects, :max_hotspot_id
  end
end

