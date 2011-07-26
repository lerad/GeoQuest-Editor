class Mission


  def get_properties
    raise "get_properties is not implemented"
  end

  def query_image_usage(adapter, image_path)
    raise "query_image_usage is not implemented for " + get_properties()["name"]
  end

end