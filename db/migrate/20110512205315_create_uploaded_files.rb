class CreateUploadedFiles < ActiveRecord::Migration
  def self.up
    create_table :uploaded_files do |t|

      t.timestamps
    end
  end

  def self.down
    drop_table :uploaded_files
  end
end
