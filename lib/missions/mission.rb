# Copyright 2011, Folker Hoffmann
# Licensed under the MIT license
# See http://www.opensource.org/licenses/mit-license.php

class Mission


  def get_properties
    raise "get_properties is not implemented"
  end

  def get_template
    raise "get_template is not implemented for " + get_properties()["name"]
  end

  def query_image_usage(adapter, image_path)
    raise "query_image_usage is not implemented for " + get_properties()["name"]
  end

end