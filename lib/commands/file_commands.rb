# Copyright 2011, Folker Hoffmann
# Licensed under the MIT license
# See http://www.opensource.org/licenses/mit-license.php

require 'commands/command'


class DeleteFileCommand < Command
  def initialize(params)
    super(params)
    @type = "DeleteFileCommand"

    @command = nil

  end

  def on_execute
    file_path = Rails.root.join("public", "projects", @params[:project_id], @params[:path]).to_s
    Rails.logger.info("Delete: " + file_path)
    File.delete(file_path)
  end

end

class MoveFileCommand < Command
  def initialize(params)
    super(params)
    @type = "MoveFileCommand"

    @command = nil

  end

  def on_execute
    path_from = Rails.root.join("public", "projects", @params[:project_id].to_s, @params[:from]).to_s
    path_to = Rails.root.join("public", "projects", @params[:project_id].to_s, @params[:to]).to_s

    FileUtils.mv(path_from, path_to)
    Rails.logger.info("Move: " + @params[:from] + " to " + @params[:to])
  end

end

class ImportFileCommand < Command
  def initialize(params)
    super(params)
    @type = "ImportFileCommand"
    @command = nil
  end

  def on_execute
    path_from = Rails.root.join("public", "projects", @params[:from_project_id].to_s, @params[:from]).to_s
    path_to = Rails.root.join("public", "projects", @params[:project_id].to_s, @params[:to]).to_s

    FileUtils.copy(path_from, path_to)
    Rails.logger.info("Copy " + @params[:from] + " from project " + @params[:from_project_id].to_s + " to " + @params[:to] + " in project " + @params[:project_id])
  end

end


class UploadFileCommand < Command
  def initialize(params)
    super(params)
    @type = "UploadFileCommand"
    @command = nil
  end

  def on_execute
    path = Rails.root.join("public", "projects", @params[:project_id], @params[:target_dir])
    UploadedFile.save(@params[:name], path, @params[:uploadedFile])
    Rails.logger.info("Upload new File to " + path.to_s + " in project " + @params[:project_id])
  end

end