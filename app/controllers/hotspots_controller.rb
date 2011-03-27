require 'commands/command'
require 'commands/hotspot_commands'

class HotspotsController < ApplicationController
  def update
   cmd = MoveHotspotCommand.new(params)
   cmd.execute
  end

  def create
    cmd = AddHotspotCommand.new(params)
    cmd.execute
  end

end
