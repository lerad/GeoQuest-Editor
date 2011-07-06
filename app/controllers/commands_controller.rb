require 'commands/command'
require 'commands/common_commands'
require 'commands/hotspot_commands'
require 'commands/npctalk_commands'
require 'commands/mission_commands'
require 'commands/question_commands'
require 'commands/xmlfile_commands'
require 'commands/mission_visualization_commands'

class CommandsController < ApplicationController

  def execute

    cmd = nil

    case params[:command]
      when "AddHotspotCommand"
        cmd = AddHotspotCommand.new(params)
      when "MoveHotspotCommand"
        cmd = MoveHotspotCommand.new(params)
      when "AddDialogEntryCommand"
        cmd = AddDialogEntryCommand.new(params)
      when "DeleteDialogEntryCommand"
        cmd = DeleteDialogEntryCommand.new(params)
      when "MoveDialogEntryUpCommand"
        cmd = MoveDialogEntryUpCommand.new(params)
      when "MoveDialogEntryDownCommand"
        cmd = MoveDialogEntryDownCommand.new(params)
      when "AddXmlNodeToMission"
        cmd = AddXmlNodeToMission.new(params)
      when "UpdateXmlNodeContentInMission"
        cmd = UpdateXmlNodeContentInMission.new(params)
      when "DeleteXmlNodeFromMission"
        cmd = DeleteXmlNodeFromMission.new(params)
      when "DeleteHotspotCommand"
        cmd = DeleteHotspotCommand.new(params)
      when "AddSubmissionCommand"
        cmd = AddSubmissionCommand.new(params)
      when "AddMissionCommand"
        cmd = AddMissionCommand.new(params)
      when "AddQuestionCommand"
        cmd = AddQuestionCommand.new(params)
      when "AddAnswerCommand"
        cmd = AddAnswerCommand.new(params)
      when "UpdateAttributeInMission"
        cmd = UpdateAttributeInMission.new(params)
      when "UpdateQuestionTextCommand"
        cmd = UpdateQuestionTextCommand.new(params)
      when "UpdateAnswerOnChooseTextCommand"
        cmd = UpdateAnswerOnChooseTextCommand.new(params)
      when "UpdateAnswerTextCommand"
       cmd = UpdateAnswerTextCommand.new(params)
      when "DeleteQuestionCommand"
       cmd = DeleteQuestionCommand.new(params)
      when "DeleteAnswerCommand"
       cmd = DeleteAnswerCommand.new(params)
      when "UpdateHotspotCommand"
       cmd = UpdateHotspotCommand.new(params)
      when "UpdateXmlFileCommand"
       cmd = UpdateXmlFileCommand.new(params)
      when "DeleteMissionCommand"
       cmd = DeleteMissionCommand.new(params);
      when "MoveMissionVisualizationCommand"
       cmd = MoveMissionVisualizationCommand.new(params);
      when "MoveHotspotVisualizationCommand"
       cmd = MoveHotspotVisualizationCommand.new(params);
    else
        logger.warn "Unsupported command: " + params[:command]
    end
    begin
      cmd.execute unless cmd.nil?
      render :text => "Command successfull done"
    rescue Exception => e
      msg = "Error: " + e.to_s
      render :text => msg, :status => 500
    end
  end

end
