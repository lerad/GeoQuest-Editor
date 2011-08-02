# Copyright 2011, Folker Hoffmann
# Licensed under the MIT license
# See http://www.opensource.org/licenses/mit-license.php

require "net/http"
require "uri"
require "rexml/document"

include REXML

#TODO: Refactor this code. Die Parameter sind unschön und die
# URL sollte konfigurierbar sein

 class ExistAdapter

   def initialize(collection)
    @collection = collection.to_s
   end

   RESTURL = "http://localhost:8080/exist/rest/db/geoquest/"

   def upload_data_as_filename(data, filename)
    url = URI.parse(RESTURL + @collection + '/' + filename)
    request = Net::HTTP::Put.new(url.path)
    request.content_type = "text/xml"
    request.body = data
    res = Net::HTTP.start(url.host, url.port) { |http| http.request(request)}
    Rails.logger.debug(res.body);
   end

   def delete_collection(collection)
     url = URI.parse(RESTURL + collection.to_s)
     request = Net::HTTP::Delete.new(url.path)
     res = Net::HTTP.start(url.host, url.port) { |http| http.request(request)}
     Rails.logger.debug(res.body)
   end

  def get_file_as_string(filename)
    data = ''
    f = File.open(filename, "r")
    f.each_line do |line|
      data += line
    end
    return data
 end


   def upload_file_as_filename(file, filename)
     data = get_file_as_string(file)
     upload_data_as_filename(data, filename)
   end

# TODO: Das Query Max Problem lösen. Eventuell mehrere Aufrufe.
# Dann aber auch konkret sagen, wofür die Funktion gut ist
# 
# Returns array of Elements
def do_request(xquery)

  url = URI.parse(RESTURL + @collection)
  request = Net::HTTP::Post.new(url.path)
 request.body = "<query xmlns=\"http://exist.sourceforge.net/NS/exist\" max=\"40\"><text><![CDATA[\n" + xquery + "]]>\n</text></query>"
 request.content_type = "text/xml"

 response = Net::HTTP.start(url.host, url.port) {|http| http.request(request)}

 doc = Document.new(response.body)
 doc.root.elements.to_a
 end
 
  
end