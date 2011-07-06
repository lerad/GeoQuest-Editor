require 'commands/command'

class MoveMissionVisualizationCommand < Command
  def initialize(params)
    super(params)
    @type = "MoveMissionVisualizationCommand"

    template = ERB.new <<-EOF
let $x := doc("editor.xml")//mission[@id="<%= params["mission_id"] %>"]/x
let $y := doc("editor.xml")//mission[@id="<%= params["mission_id"] %>"]/y

return (# exist:batch-transaction #) {
  update value $x with "<%= params["x"] %>",
  update value $y with "<%= params["y"] %>"
}
EOF

    @command = template.result(binding)

  end
end



class MoveHotspotVisualizationCommand < Command
  def initialize(params)
    super(params)
    @type = "MoveHotspotVisualizationCommand"

    template = ERB.new <<-EOF
let $x := doc("editor.xml")//hotspot[@id="<%= params["hotspot_id"] %>"]/x
let $y := doc("editor.xml")//hotspot[@id="<%= params["hotspot_id"] %>"]/y

return (# exist:batch-transaction #) {
  update value $x with "<%= params["x"] %>",
  update value $y with "<%= params["y"] %>"
}
EOF

    @command = template.result(binding)

  end
end