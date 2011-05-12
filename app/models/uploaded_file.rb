class UploadedFile < ActiveRecord::Base

  
  # based on:
  # http://shinylittlething.com/2009/07/20/multiple-file-upload-using-jquery-and-ruby-on-rails-tutorial/
  def self.save(name, directory, upload)

    #return false if upload.blank?

    # create the file path
    path = File.join(directory, name)

    Rails.logger.warn("Path: " + path.to_s)

    # write the file
    File.open(path, "wb") { |f| f.write(upload.read) }


  end
end
