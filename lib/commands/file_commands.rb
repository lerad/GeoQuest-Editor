require 'commands/command'


class DeleteFileCommand < Command
  def initialize(params)
    super(params)
    @type = "DeleteFileCommand"

    @command = nil

  end

  def on_execute
    project_path = Rails.root.join("public", "projects", @params[:project_id]).to_s
    file_path = project_path + @params[:path]
    Rails.logger.info("Delete: " + file_path)
    File.delete(file_path)
  end

end