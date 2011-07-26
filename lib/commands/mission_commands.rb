require 'commands/command'


  def create_mission_entry(type, id)
    case type
    when "MapOverview"
      mission_template = ERB.new <<-EOF
<mission type="MapOverview"
         id="<%= id %>"
         name="MapOverview_<%= id %>"
         cancel="success"
         mapkind="satellite">
<hotspots />
</mission>
EOF
    when "QuestionAndAnswer"
      mission_template = ERB.new <<-EOF
<mission type="QuestionAndAnswer"
         id="<%= id %>"
         name="QuestionAndAnswer_<%= id %>"
         questions="0"
         correctAnswersNeeded="0"
         shuffle="false"
         cancel="success">
</mission>
EOF
    when "NPCTalk"
      mission_template = ERB.new <<-EOF
<mission type="NPCTalk"
         id="<%= id %>"
         name="NPCTalk_<%= id %>"
         charImage=""
         cancel="success">
</mission>
EOF
    when "WebPage"
      mission_template = ERB.new <<-EOF
      <mission type="WebPage"
         id="<%= id %>"
         name="WebPage_<%= id %>"
         url="http://www.example.com"
         cancel="success">
</mission>
EOF
    end

    return mission_template.result(binding) unless mission_template.nil?

    # TODO Error handling
  end
  

class AddSubmissionCommand < Command
  def initialize(params)
    super(params)
    @type = "AddSubmissionCommand"

    node = create_mission_entry(params["submission_type"], params["submission_id"])

    template = ERB.new <<-EOF
let $newMission := <%= node %>
let $parentMission := doc("game.xml")//mission[@id="<%= params["mission_id"] %>"]
return update insert $newMission into $parentMission
EOF

    @command = template.result(binding)

  end

end

class AddMissionCommand < Command
  def initialize(params)
    super(params)
    @type = "AddMissionCommand"

    node = create_mission_entry(params["new_mission_type"], params["new_mission_id"])

    template = ERB.new <<-EOF
let $newMission := <%= node %>
return update insert $newMission into doc("game.xml")/game
EOF

    @command = template.result(binding)

  end

end


class DeleteMissionCommand < Command
  def initialize(params)
    super(params)
    @type = "DeleteMissionCommand"


    template = ERB.new <<-EOF
let $mission := doc("game.xml")//mission[@id="<%= params["mission_id"] %>"]
return update delete $mission
EOF

    @command = template.result(binding)

  end

end