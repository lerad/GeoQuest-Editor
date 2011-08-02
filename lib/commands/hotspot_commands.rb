# Copyright 2011, Folker Hoffmann
# Licensed under the MIT license
# See http://www.opensource.org/licenses/mit-license.php

require 'commands/command'

class AddHotspotCommand < Command
  def initialize(params)
    super(params)
    @type = "AddHotspotCommand"

    template = ERB.new <<-EOF
let $newHotspot := <hotspot id="<%= params["id"] %>" 
         latitude="<%= params["latitude"] %>" 
         longitude="<%= params["longitude"] %>" 
         radius="30">
           <img src=""/>
        </hotspot>
let $hotspots := doc("game.xml")//mission[@id = "<%= params["mission_id"] %>"]/hotspots
return update insert $newHotspot into $hotspots
EOF

@command = template.result(binding)
  end
end

class MoveHotspotCommand < Command
  def initialize(params)
    super(params)
    @type = "MoveHotspotCommand"

    template = ERB.new <<-EOF
let $mission := doc("game.xml")/game/mission[@id = "<%= params["mission_id"] %>"]
let $hotspot := $mission/hotspots/hotspot[@id = "<%= params["id"] %>"]
return (# exist:batch-transaction #) {
  update value $hotspot/@latitude with "<%= params["latitude"] %>",
  update value $hotspot/@longitude with "<%= params["longitude"] %>"
}
EOF

    @command = template.result(binding)
  end
end

class DeleteHotspotCommand < Command
    def initialize(params)
    super(params)
    @type = "DeleteHotspotCommand"

    template = ERB.new <<-EOF
let $mission := doc("game.xml")//mission[@id="<%= params["mission_id"] %>"]
let $hotspot := $mission/hotspots/hotspot[@id="<%= params["id"] %>"]
return update delete $hotspot
EOF

    @command = template.result(binding)

  end
end


 # Special Parameter:
 # image, radius, hotspot_id
 
class UpdateHotspotCommand < Command
    def initialize(params)
    super(params)
    @type = "UpdateHotspotCommand"

    template = ERB.new <<-EOF
let $mission := doc("game.xml")//mission[@id="<%= params["mission_id"] %>"]
let $hotspot := $mission/hotspots/hotspot[@id="<%= params["hotspot_id"] %>"]

return (# exist:batch-transaction #) {
  update value $hotspot/@radius with "<%= params["radius"] %>",
  update value $hotspot/img/@src with "<%= params["image"] %>"
}


EOF

    @command = template.result(binding)

  end
end