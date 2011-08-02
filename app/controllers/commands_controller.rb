# Copyright 2011, Folker Hoffmann
# Licensed under the MIT license
# See http://www.opensource.org/licenses/mit-license.php

require 'commands/command'
require 'commands/common_commands'
require 'commands/hotspot_commands'
require 'commands/npctalk_commands'
require 'commands/mission_commands'
require 'commands/question_commands'
require 'commands/xmlfile_commands'
require 'commands/mission_visualization_commands'
require 'commands/file_commands'
require 'commands/project_commands'

class CommandsController < ApplicationController

  before_filter :authenticate

  def initialize()
    @commands = {
        "AddHotspotCommand" => AddHotspotCommand,
        "MoveHotspotCommand" => MoveHotspotCommand,
        "AddDialogEntryCommand" => AddDialogEntryCommand,
        "DeleteDialogEntryCommand" => DeleteDialogEntryCommand,
        "MoveDialogEntryUpCommand" => MoveDialogEntryUpCommand,
        "MoveDialogEntryDownCommand" => MoveDialogEntryDownCommand,
        "AddXmlNodeToMission" => AddXmlNodeToMission,
        "UpdateXmlNodeContentInMission" => UpdateXmlNodeContentInMission,
        "DeleteXmlNodeFromMission" => DeleteXmlNodeFromMission,
        "DeleteHotspotCommand" => DeleteHotspotCommand,
        "AddSubmissionCommand" => AddSubmissionCommand,
        "AddMissionCommand" => AddMissionCommand,
        "AddQuestionCommand" => AddQuestionCommand,
        "AddAnswerCommand" => AddAnswerCommand,
        "UpdateAttributeInMission" => UpdateAttributeInMission,
        "UpdateQuestionTextCommand" => UpdateQuestionTextCommand,
        "UpdateAnswerOnChooseTextCommand" => UpdateAnswerOnChooseTextCommand,
        "UpdateAnswerTextCommand" => UpdateAnswerTextCommand,
        "DeleteQuestionCommand" => DeleteQuestionCommand,
        "DeleteAnswerCommand" => DeleteAnswerCommand,
        "UpdateHotspotCommand" => UpdateHotspotCommand,
        "UpdateXmlFileCommand" => UpdateXmlFileCommand,
        "DeleteMissionCommand" => DeleteMissionCommand,
        "MoveMissionVisualizationCommand" => MoveMissionVisualizationCommand,
        "MoveHotspotVisualizationCommand" => MoveHotspotVisualizationCommand,
        "CreateNewEventCommand" => CreateNewEventCommand,
        "DeleteFileCommand" => DeleteFileCommand,
        "MoveFileCommand" => MoveFileCommand,
        "ImportFileCommand" => ImportFileCommand,
        "UploadFileCommand" => UploadFileCommand,
        "ChangeProjectNameCommand" => ChangeProjectNameCommand,
        "CreateNewRuleCommand" => CreateNewRuleCommand,
        "UpdateRuleCommand" => UpdateRuleCommand,
        "DeleteRuleCommand" => DeleteRuleCommand
    }
  end

  def execute
    @project = Project.find(:first, :conditions => {:id => params[:project_id], :user_id => @current_user.id})
    if @project.nil?
      Rails.logger.info("Invalid project id for command: " + params[:project_id]  + " or the project is not owned by the user with id " + @current_user.id)
      raise "Invalid project id"
    end

    cmd = nil
    begin
      if @commands.has_key?( params[:command] )
          cmd = @commands[ params[:command] ].new(params)
      else
          logger.error "Unsupported command: " + params[:command]
          render :text => "Unsupported command: " + params[:command]
          return
      end
      Rails.logger.info("Start execute: " + params[:command])
      cmd.execute unless cmd.nil?
      render :text => "Command successfull done"
    rescue Exception => e
      msg = "Error: " + e.to_s
      Rails.logger.error(msg)
      render :text => msg, :status => 500
    end
  end

end
