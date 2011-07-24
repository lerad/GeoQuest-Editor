class Mission

  @properties = nil

  def get_properties
    return @properties
  end

  def query_image_usage(adapter, image_path)
    raise "query_image_usage is not implemented for " + @properties["name"]
  end

end