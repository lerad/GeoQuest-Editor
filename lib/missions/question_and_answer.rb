require 'missions/mission'

class QuestionAndAnswer < Mission


  def query_image_usage(adapter, image_path)
    # The QuestionAndAnswer Mission uses no images
    return []
  end

end