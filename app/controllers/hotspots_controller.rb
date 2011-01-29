class HotspotsController < ApplicationController
  def update
    #TODO:   Check if the user owns the project
    adapter = ExistAdapter.new(params[:project])

    command = '    (# exist:batch-transaction #) {
update value doc("game.xml")/game/mission[@id = "1"]/hotspots/hotspot[@id = "' + params[:id] + '"]/@latitude with ' + params[:latitude] + ',
update value doc("game.xml")/game/mission[@id = "1"]/hotspots/hotspot[@id = "' + params[:id] + '"]/@longitude with ' + params[:longitude] + '
}'
    adapter.do_request(command)

  end

  def create
    #TODO:   Check if the user owns the project
    adapter = ExistAdapter.new(params[:project])

    command = 'let $newHotspot := <hotspot id="' + params[:id] + '" latitude="' + params[:latitude] + "\"\n" +
              'longitude="' + params[:longitude] + '" radius="30">' + "\n" +
              '<img src="drawable/default.png"/>' + "\n" +
              '</hotspot>' + "\n" +
              'let $hotspots := doc("game.xml")//mission[@id = "1"]/hotspots' + "\n" +
              'return update insert $newHotspot into $hotspots'

    adapter.do_request(command)

  end

end
