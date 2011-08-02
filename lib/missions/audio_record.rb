# Copyright 2011, Folker Hoffmann
# Licensed under the MIT license
# See http://www.opensource.org/licenses/mit-license.php

require 'missions/mission'

class AudioRecord < Mission
  def get_properties
   return {
    "name" => "AudioRecord",
    "has_submissions" => false,
    "icon" => "/images/icons/AudioRecord.png"
  }
  end

  def get_template
 return <<-EOF
      <mission type="AudioRecord"
         id="<%= id %>"
         name="AudioRecord_<%= id %>"
         cancel="success">
</mission>
EOF
  end

  def query_image_usage(adapter, image_path)
   template = ERB.new <<-EOF
    doc("game.xml")//mission[@type="AudioRecord"][@initial_image="<%= image_path %>"]
EOF
    query = template.result(binding)
    results = adapter.do_request(query)
    usages = []
    results.each do |result|
      usages += [{
        "id" => result.attributes["id"],
        "name" => result.attributes["name"],
        "type" => "AudioRecord",
        "comment" => ""
      }]
    end
    return usages
  end
end