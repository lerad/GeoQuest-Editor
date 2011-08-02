# Copyright 2011, Folker Hoffmann
# Licensed under the MIT license
# See http://www.opensource.org/licenses/mit-license.php

require 'commands/command'

# Commands which can be used for every mission
# Generic XML Transformatins

# Adds a blank xml node to a specific mission
# Param: "node": The name of the xml node
class AddXmlNodeToMission < Command
  def initialize(params)
    super(params)
    @type = "AddXmlNodeToMission"

    

    template = ERB.new <<-EOF
let $newNode := <<%= params["node"] %>></<%= params["node"] %>>
let $mission := doc("game.xml")//mission[@id="<%= params["mission_id"] %>"]
return update insert $newNode into $mission
EOF

    @command = template.result(binding)

  end
end

# Deletes a xml node from a specific mission
# Param: "node": The name of the xml node
class DeleteXmlNodeFromMission < Command
  def initialize(params)
    super(params)
    @type = "DeleteXmlNodeFromMission"

    template = ERB.new <<-EOF
let $node := doc("game.xml")//mission[@id="<%= params["mission_id"] %>"]/<%= params["node"] %>
return update delete $node
EOF

    @command = template.result(binding)

  end
end

# Updates the text contents of the values of a specific node
# Param: "node": The name of the xml node
# Param: "value": The new value
class UpdateXmlNodeContentInMission < Command
  def initialize(params)
    super(params)
    @type = "UpdateXmlNodeContentInMission"

    template = ERB.new <<-EOF
let $node := doc("game.xml")//mission[@id="<%= params["mission_id"] %>"]/<%= params["node"] %>
return  update value $node with "<%= params["value"] %>"
EOF

    @command = template.result(binding)

  end
end



# Updates one attribute of a specific node
# Creates the attribute if it does not already exist
#
# Param: mission_id: To specify the node
# Param: project_id: To sepcifiy the project
# Param: "attribute": The name of the attribute
# Param: "value": The new value
class UpdateAttributeInMission < Command
  def initialize(params)
    super(params)
    @type = "UpdateAttributeInMission"

    template = ERB.new <<-EOF
let $mission := doc("game.xml")//mission[@id="<%= params["mission_id"] %>"]
return  update insert attribute <%= params["attribute"] %>{"<%= params["value"] %>"} into  $mission
EOF

    @command = template.result(binding)

  end
end