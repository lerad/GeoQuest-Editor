class AddMaxEventIdToProjects < ActiveRecord::Migration
  def self.up
    add_column :projects, :max_event_id, :integer, :default => 0
  end

  def self.down
    remove_column :projects, :max_event_id
  end
end
