require 'commands/command'

class AddHotspotCommand < Command
  def initialize(params)
    super(params)
    @type = "AddHotspotCommand"

    @command = 'let $newHotspot := <hotspot id="' + params["id"] + '" latitude="' + params["latitude"] + "\"\n" +
               'longitude="' + params["longitude"] + '" radius="30">' + "\n" +
               '<img src="drawable/default.png"/>' + "\n" +
               '</hotspot>' + "\n" +
               'let $hotspots := doc("game.xml")//mission[@id = "1"]/hotspots' + "\n" +
               'return update insert $newHotspot into $hotspots'

  end
end

class MoveHotspotCommand < Command
  def initialize(params)
    super(params)
    @type = "MoveHotspotCommand"

    @command = '(# exist:batch-transaction #) {' + "\n" +
               'update value doc("game.xml")/game/mission[@id = "1"]/hotspots/hotspot[@id = "' + params["id"] + '"]/@latitude with ' + params["latitude"] + ',' + "\n" +
               'update value doc("game.xml")/game/mission[@id = "1"]/hotspots/hotspot[@id = "' + params["id"] + '"]/@longitude with ' + params["longitude"] + "\n" +
               '}'
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