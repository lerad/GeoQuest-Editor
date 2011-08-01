class AddLastModifiedToProjects < ActiveRecord::Migration
  def self.up
     add_column :projects, :last_modified, :timestamp, :default => Time.now
  end

  def self.down
     remove_column :projects, :last_modified
  end
end

