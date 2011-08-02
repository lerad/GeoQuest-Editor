# Copyright 2011, Folker Hoffmann
# Licensed under the MIT license
# See http://www.opensource.org/licenses/mit-license.php

require 'missions/mission'

class QRTagReading < Mission
  def get_properties
   return {
    "name" => "QRTagReading",
    "has_submissions" => false,
    "icon" => "/images/icons/QRTagReading.png"
  }
  end

  def get_template
 return <<-EOF
      <mission type="QRTagReading"
         id="<%= id %>"
         name="QRTagReading_<%= id %>"
         mode="treasure"
         cancel="success">
</mission>
EOF
  end

  def query_image_usage(adapter, image_path)
   template = ERB.new <<-EOF
    doc("game.xml")//mission[@type="QRTagReading"][@initial_image="<%= image_path %>"]
EOF
    query = template.result(binding)
    results = adapter.do_request(query)
    usages = []
    results.each do |result|
      usages += [{
        "id" => result.attributes["id"],
        "name" => result.attributes["name"],
        "type" => "QRTagReading",
        "comment" => ""
      }]
    end
    return usages
  end
end