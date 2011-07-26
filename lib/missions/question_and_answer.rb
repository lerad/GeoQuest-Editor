require 'missions/mission'

class QuestionAndAnswer < Mission
  def get_properties
    return  {
    "name" => "QuestionAndAnswer",
    "has_submissions" => false,
    "icon" => "/images/icons/QuestionAndAnswer.gif"
  }
  end

  def query_image_usage(adapter, image_path)
    # The QuestionAndAnswer Mission uses no images
    return []
  end

end