module ProjectsHelper
  def load_mission_list_from_xml(adapter)
    MissionNode mission_list = {}
 
    #hotspots_query = 'doc("game.xml")/game/mission[@id = "1"]/hotspots/hotspot'

    adapter.do_request(xquery)


    return mission_list
  end
end
