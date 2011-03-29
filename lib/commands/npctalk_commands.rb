require 'commands/command'

class AddDialogEntryCommand < Command
  def initialize(params)
    super(params)
    @type = "AddDialogEntryCommand"

    @command = 'let $newItem := <dialogitem speaker="' + params["speaker"] + '">' +
                                params["text"] + '</dialogitem>' + "\n" +
               'let $mission := doc("game.xml")//mission[@id="' + params["mission_id"] + '"]' + "\n" +
               'return update insert $newItem into $mission';

  end
end