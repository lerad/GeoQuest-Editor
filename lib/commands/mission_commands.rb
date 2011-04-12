require 'commands/command'


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

  def create_mission_entry(type, id)
    case type
    when "MapOverview"
      mission_template = ERB.new <<-EOF
<mission type="MapOverview"
         id="<%= id %>"
         cancel="success"
         mapkind="satellite">
<hotspots />
</mission>
EOF
    when "QuestionAndAnswer"
      mission_template = ERB.new <<-EOF
<mission type="QuestionAndAnswer"
         id="<%= id %>"
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
         cancel="success">
</mission>
EOF
    end

    return mission_template.result(binding) unless mission_template.nil?

    # TODO Error handling
  end

end

