# Copyright 2011, Folker Hoffmann
# Licensed under the MIT license
# See http://www.opensource.org/licenses/mit-license.php


require 'commands/command'

class ChangeProjectNameCommand < Command
  def initialize(params)
    super(params)
    @type = "ChangeProjectNameCommand"

    template = ERB.new <<-EOF
let $game := doc("game.xml")/game
return  update insert attribute name{"<%= params["name"] %>"} into  $game
EOF

    @command = template.result(binding)

  end

  def on_execute
    project = Project.find(:first, :conditions => {:id => @params[:project_id] })
    project.name = @params[:name]
    project.save()

  end

end