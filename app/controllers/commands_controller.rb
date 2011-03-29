require 'commands/command'
require 'commands/hotspot_commands'
require 'commands/npctalk_commands'

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
      else
        logger.warning "Unsupported command: " + params[:command]
    end

    cmd.execute unless cmd.nil?

  end

end
