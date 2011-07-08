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


class CreateNewEventCommand < Command
  def initialize(params)
    super(params)
    @type = "CreateNewEventCommand"

    event_holder = params["event_holder"];
    event = params["event"];

    if(event["id"].nil?)
      Rails.logger.debug("Create id");
      event["id"] = "e" + rand(1000).to_s
    end

    event_template = ERB.new <<-EOF
    <<%= event["type"] %> id="<%= event["id"] %>">
    <% if event["nextMission"] != "none" %>
    <comStartMission id="<%= event["nextMission"] %>" />
    <% end %>
    <% event["requirements"].each do |index, requirement| %>
    <%= requirement["xml"] %>
    <% end %>
    </<%= event["type"] %>>
EOF

    event_xml = event_template.result(binding);

    template = ERB.new <<-EOF
let $newEvent := <%= event_xml %>
let $eventHolder := doc("game.xml")//<%= params["event_holder_type"] %>[@id="<%= event_holder["id"] %>"]
return update insert $newEvent into $eventHolder
EOF

    @command = template.result(binding)

  end
end