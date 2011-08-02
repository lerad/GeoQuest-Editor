# Copyright 2011, Folker Hoffmann
# Licensed under the MIT license
# See http://www.opensource.org/licenses/mit-license.php

require 'missions/mission'

class WebPage < Mission
  def get_properties
   return {
    "name" => "WebPage",
    "has_submissions" => false,
    "icon" => "/images/icons/WebPage.gif"
  }
  end

  def get_template
 return <<-EOF
      <mission type="WebPage"
         id="<%= id %>"
         name="WebPage_<%= id %>"
         url=""
         cancel="success">
</mission>
EOF
  end

  # The webpage mission does not use images
  def query_image_usage(adapter, image_path)

    return []
  end
end