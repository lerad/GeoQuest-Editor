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

  # The webpage mission does not use images
  def query_image_usage(adapter, image_path)

    return []
  end
end