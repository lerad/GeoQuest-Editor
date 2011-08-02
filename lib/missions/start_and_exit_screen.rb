# Copyright 2011, Folker Hoffmann
# Licensed under the MIT license
# See http://www.opensource.org/licenses/mit-license.php

require 'missions/mission'

class StartAndExitScreen < Mission
  def get_properties
    return {
      "name" => "StartAndExitScreen",
      "has_submissions" => false,
      "icon" => "/images/icons/StartAndExitScreen.gif"
    }
  end

  def get_template
    return  <<-EOF
    <mission cancel="no"
             id="<%= id %>"
             image=""
             name="StartAndExitScreen_<%= id %>"
             type="StartAndExitScreen">
</mission>
EOF
  end

  def query_image_usage(adapter, image_path)
    template = ERB.new <<-EOF
    doc("game.xml")//mission[@type="StartAndExitScreen"][@image="<%= image_path %>"]
EOF
    query = template.result(binding)
    results = adapter.do_request(query)
    usages = []
    results.each do |result|
      usages += [{
        "id" => result.attributes["id"],
        "name" => result.attributes["name"],
        "type" => "StartAndExitScreen",
        "comment" => ""
      }]
    end
    return usages
  end

end