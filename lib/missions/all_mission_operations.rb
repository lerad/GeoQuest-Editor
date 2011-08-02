# Copyright 2011, Folker Hoffmann
# Licensed under the MIT license
# See http://www.opensource.org/licenses/mit-license.php

require "missions/mission"
require "missions/map_overview"
require "missions/npc_talk"
require "missions/start_and_exit_screen"
require "missions/question_and_answer"
require "missions/webpage"
require "missions/qr_tag_reading"
require "missions/audio_record"
require "missions/image_capture"

require "exist_adapter"

class AllMissionOperations

  def initialize
  @object_map = {
    "MapOverview" => MapOverview.new(),
    "NPCTalk" => NPCTalk.new(),
    "QuestionAndAnswer" => QuestionAndAnswer.new(),
    "StartAndExitScreen" => StartAndExitScreen.new(),
    "WebPage" => WebPage.new(),
    "QRTagReading" => QRTagReading.new(),
    "AudioRecord" => AudioRecord.new(),
    "ImageCapture" => ImageCapture.new()
  }

  @object_map = Hash[@object_map.sort]

  end

  def get_all_mission_properties
    properties = {}
    @object_map.each do |key, value|
      properties[key] = value.get_properties()
    end
    return properties
  end

  def get_mission_type_template(type)
    return @object_map[type].get_template();
  end

  def get_mission_type_properties(type)
    return @object_map[type].get_properties();
  end

  # Checks if there are any missions which use this image
  # Returns an array of all missions (id, name, type, comment) which use this
  # Image
  def query_image_usage(project_id, image_path)
    adapter = ExistAdapter.new(project_id)
    usages = []
    @object_map.each do |key, value|
      usages += value.query_image_usage(adapter, image_path)
    end
    return usages
  end

  def rename_image_name
    
  end

end

