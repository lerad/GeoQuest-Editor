# Copyright 2011, Folker Hoffmann
# Licensed under the MIT license
# See http://www.opensource.org/licenses/mit-license.php

require 'missions/mission'

class ImageCapture < Mission
  def get_properties
   return {
    "name" => "ImageCapture",
    "has_submissions" => false,
    "icon" => "/images/icons/ImageCapture.gif"
  }
  end

  def get_template
 return <<-EOF
      <mission type="ImageCapture"
         id="<%= id %>"
         name="ImageCapture_<%= id %>"
         cancel="success">
</mission>
EOF
  end

  def query_image_usage(adapter, image_path)
   template = ERB.new <<-EOF
    doc("game.xml")//mission[@type="ImageCapture"][@initial_image="<%= image_path %>"]
EOF
    query = template.result(binding)
    results = adapter.do_request(query)
    usages = []
    results.each do |result|
      usages += [{
        "id" => result.attributes["id"],
        "name" => result.attributes["name"],
        "type" => "ImageCapture",
        "comment" => ""
      }]
    end
    return usages
  end
end