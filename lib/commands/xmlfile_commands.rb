# Copyright 2011, Folker Hoffmann
# Licensed under the MIT license
# See http://www.opensource.org/licenses/mit-license.php


require 'commands/command'

class UpdateXmlFileCommand < Command
  
  @xmlfile = ""

  def initialize(params)
    super(params)
    @type = "UpdateXmlFileCommand"

    @command = nil
    @xmlfile = params[:xmlfile]

  end

  def on_execute()
    #TODO: Delete history
    # Upload new game.xml:
    @adapter.upload_data_as_filename(@xmlfile, "game.xml")

  end

end