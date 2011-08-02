# Copyright 2011, Folker Hoffmann
# Licensed under the MIT license
# See http://www.opensource.org/licenses/mit-license.php

require 'missions/mission'

class QuestionAndAnswer < Mission
  def get_properties
    return  {
    "name" => "QuestionAndAnswer",
    "has_submissions" => false,
    "icon" => "/images/icons/QuestionAndAnswer.gif"
  }
  end

  def get_template
    return  <<-EOF
<mission type="QuestionAndAnswer"
         id="<%= id %>"
         name="QuestionAndAnswer_<%= id %>"
         questions="0"
         correctAnswersNeeded="0"
         shuffle="false"
         cancel="success">
</mission>
EOF
  end

  def query_image_usage(adapter, image_path)
    # The QuestionAndAnswer Mission uses no images
    return []
  end

end