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
    request.content_type = "text/xml"
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

# Returns array of Elements
def do_request(xquery)

  url = URI.parse('http://localhost:8090/exist/rest/db/geoquest/32')
  request = Net::HTTP::Post.new(url.path)
 request.body = "<query xmlns=\"http://exist.sourceforge.net/NS/exist\"><text><![CDATA[\n" + xquery + "]]>\n</text></query>"
 request.content_type = "text/xml"

 response = Net::HTTP.start(url.host, url.port) {|http| http.request(request)}

 doc = Document.new(response.body)
 result = doc.root.elements.to_a
 end
 
  
end