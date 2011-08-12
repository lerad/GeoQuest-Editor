# Copyright 2011, Folker Hoffmann
# Licensed under the MIT license
# See http://www.opensource.org/licenses/mit-license.php

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

  def createConditionXml(condition)
    
    if (condition[:token] == "var")
      return "<var>" + condition[:data][:name] + "</var>\n"
    end
    if (condition[:token] == "num")
      return "<num>" + condition[:data][:value] + "</num>\n"
    end
    if (condition[:token] == "missionState")
      id = condition[:data][:mission]
      state = condition[:data][:state]
      return '<missionState id="' + id + '" state="' + state + '" />' + "\n"
    end
    text = "<" + condition[:token] + ">\n"
    condition[:children].each do |index, child|
      text += createConditionXml(child)
    end
    text += "</" + condition[:token] + ">\n"
    return text
  end

class CreateNewRuleCommand < Command

  def initialize(params)
    super(params)
    @type = "CreateNewRuleCommand"


    rule = @params[:rule]
    rule_holder = @params[:holder]

    rule_template = ERB.new <<-EOF
    <rule id="<%= rule["id"] %>">
    <% if rule[:condition] %>
      <% unless rule[:condition].empty? %>
        <if>
          <%= createConditionXml(rule[:condition]) %>
        </if>
      <% end %>
    <% end %>
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
<% if rule[:first_one] == "true" %>
let $newEvent := <<%= rule[:type] %> />
<% end %>
let $ruleHolder := doc("game.xml")//<%= @params[:holder_type] %>[@id="<%= rule_holder["id"] %>"] 
return (# exist:batch-transaction #) {
  <% if rule[:first_one] == "true" %>
  update insert $newEvent into $ruleHolder,
  <% end %>
  update insert $newRule into $ruleHolder/<%= rule[:type] %>
}
EOF

    @command = template.result(binding)


  end
end


class DeleteRuleCommand < Command
  def initialize(params)
    super(params)

    @type = "DeleteRuleCommand"


    template = ERB.new <<-EOF
    let $node := doc("game.xml")//rule[@id="<%= params["rule_id"] %>"]
    return update delete $node
  EOF

    @command = template.result(binding)

  end
end



class UpdateRuleCommand < Command
  def initialize(params)
    super(params)
    @type = "UpdateRuleCommand"

    rule = @params[:rule]

    rule_template = ERB.new <<-EOF
    <rule id="<%= rule["id"] %>">
    <% if rule[:condition] %>
      <% unless rule[:condition].empty? %>
        <if>
          <%= createConditionXml(rule[:condition]) %>
        </if>
      <% end %>
    <% end %>
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
let $oldRule := doc("game.xml")//rule[@id="<%= rule[:id] %>"]
return update replace $oldRule with $newRule
EOF

    @command = template.result(binding)

  end
end
