require "net/http"
require "uri"
require "rexml/document"

include REXML

#TODO: Refactor this code. Die Parameter sind unschön und die
# URL sollte konfigurierbar sein

 class ExistAdapter
    RESTURL = "http://localhost:8090/exist/rest/db/geoquest/"

   def upload_data(filename, data, collection)
    url = URI.parse(RESTURL + collection + '/' + filename)
    request = Net::HTTP::Put.new(url.path)
    request.body = data
    Net::HTTP.start(url.host, url.port) { |http| http.request(request)}
  end

  def get_file_as_string(filename)
    data = ''
    f = File.open(filename, "r")
    f.each_line do |line|
      data += line
    end
    return data
 end


   def upload_file(file, filename, collection)
     data = get_file_as_string(file)
     upload_data(filename, data, collection)
   end

  
end