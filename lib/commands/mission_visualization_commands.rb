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


    event_template = ERB.new <<-EOF
    <<%= event["type"] %> id="<%= event["id"] %>">
    <% if event["next_mission"] != "none" %>
    <comStartMission id="<%= event["next_mission"] %>" />
    <% end %>

    <% if event["commands"] != "" %>
    <% event["commands"].each do |index, command| %>
    <%= command["xml"] %>
    <% end %>
    <% end %>


    <% if event["requirements"] != "" %>
    <% event["requirements"].each do |index, requirement| %>
    <%= requirement["xml"] %>
    <% end %>
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

class CreateNewRuleCommand < Command
  def initialize(params)
    super(params)
    @type = "CreateNewRuleCommand"

=begin

    rule = params["rule"]
    rule_holder = rule["holder"]

    # Todo: "if" into rule

    if rule["first_one"] == "true"
      Rails.logger.info("Create NEW on...")
    else
      Rails.logger.info("Do not create NEW on...")
    end


    rule_template = ERB.new <<-EOF
    <rule id="<%= rule["id"] %>">
    <% if rule["actions"] != "" %>
    <% rule["actions"].each do |index, action| %>
      <action <% action.each do |key, value| %> <%= key %>="<%= value %>" <% end %> />
    <% end %>
    <% end %>
    </rule>
EOF

    rule_xml = rule_template.result(binding);

    template = ERB.new <<-EOF
let $newRule := <%= rule_xml %>
let $ruleHolder := doc("game.xml")//<%= rule["holder_type"] %>[@id="<%= rule_holder["id"] %>"]/<%= rule["type"] %>
return update insert $newRule into $ruleHolder
EOF

    @command = template.result(binding)
=end
   @command = nil
  end
end

