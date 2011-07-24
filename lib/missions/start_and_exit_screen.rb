require 'missions/mission'

class StartAndExitScreen < Mission
  @properties = {
    "name" => "StartAndExitScreen",
    "has_submissions" => false
  }

  def query_image_usage(adapter, image_path)
    template = ERB.new <<-EOF
    doc("game.xml")//mission[@type="StartAndExitScreen"][@image="<%= image_path %>"]
EOF
    query = template.result(binding)
    results = adapter.do_request(query)
    usages = []
    results.each do |result|
      usages += [{
        "id" => result.attributes["id"],
        "name" => result.attributes["name"],
        "type" => "StartAndExitScreen",
        "comment" => ""
      }]
    end
    return usages
  end

end