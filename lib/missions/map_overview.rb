# Copyright 2011, Folker Hoffmann
# Licensed under the MIT license
# See http://www.opensource.org/licenses/mit-license.php

require 'missions/mission'

class MapOverview < Mission
  def get_properties
    return {
    "name" => "MapOverview",
    "has_submissions" => true,
    "icon" => "/images/icons/MapOverview.gif"
  }
  end

  def get_template
    return <<-EOF
<mission type="MapOverview"
         id="<%= id %>"
         name="MapOverview_<%= id %>"
         cancel="success"
         mapkind="satellite">
<hotspots />
</mission>
EOF
  end

  def query_image_usage(adapter, image_path)
    # Query Hotspots:
    template = ERB.new <<-EOF
let $missions := doc("game.xml")//mission[@type="MapOverview"]

for $mission in $missions
where count($mission/hotspots/hotspot/img[@src="<%= image_path %>"]) > 0
return
<usage id="{$mission/@id}" name="{$mission/@name}">
{
for $hotspot in $mission/hotspots/hotspot
where $hotspot/img/@src = "<%= image_path %>"
return <hotspot id="{$hotspot/@id}" />
}
</usage>
EOF
    query = template.result(binding)
    results = adapter.do_request(query)
    usages = []
    results.each do |result|
      if results.size > 1
        comment = "In hotspots "
      else
        comment = "In hotspot "
      end
      hotspots = XPath.match(result, "./hotspot")
      hotspots.each do |hotspot|
        if hotspot == hotspots.first
          # Nothing special
        elsif hotspot == hotspots.last
          comment += " and "
        else
          comment += ", "
        end
        comment += hotspot.attributes["id"]
      end

      usages += [{
        "id" => result.attributes["id"],
        "name" => result.attributes["name"],
        "type" => "MapOverview",
        "comment" => comment
      }]
    end
    return usages
  end

end