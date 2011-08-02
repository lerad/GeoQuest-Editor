# Copyright 2011, Folker Hoffmann
# Licensed under the MIT license
# See http://www.opensource.org/licenses/mit-license.php

require 'commands/command'

class AddDialogEntryCommand < Command
  def initialize(params)
    super(params)
    @type = "AddDialogEntryCommand"

    template = ERB.new <<-EOF
let $newItem := <dialogitem speaker="<%= params["speaker"] %>"><%= params["text"] %></dialogitem>
let $mission := doc("game.xml")//mission[@id="<%= params["mission_id"] %>"]
return update insert $newItem into $mission
EOF

    @command = template.result(binding)

  end
end

class DeleteDialogEntryCommand < Command
  def initialize(params)
    super(params)
    @type = "DeleteDialogEntryCommand"

    @command = 'let $dialogitem := doc("game.xml")//mission[@id="' + params["mission_id"] + '"]/dialogitem[' + params["index"] + "]\n" +
               'return update delete $dialogitem'

  end
end

class MoveDialogEntryUpCommand < Command
  def initialize(params)
    super(params)
    @type = "MoveDialogEntryUpCommand"

    prev_index = ((params["index"].to_i) -1).to_s;

    @command = 'let $mission := doc("game.xml")//mission[@id="' + params["mission_id"] + '"]' + "\n" +
               'let $prevDlgItem := $mission/dialogitem[' + prev_index + "]\n" +
               'let $dlgItem := $mission/dialogitem[' + params["index"] + "]\n" +
               'return (# exist:batch-transaction #) {' + "\n" +
               '  update insert $dlgItem preceding $prevDlgItem,' + "\n" +
               '  update delete $dlgItem' + "\n" +
               '}';
  end
end

class MoveDialogEntryDownCommand < Command
  def initialize(params)
    super(params)
    @type = "MoveDialogEntryDownCommand"

    next_index = ((params["index"].to_i) +1).to_s;

    @command = 'let $mission := doc("game.xml")//mission[@id="' + params["mission_id"] + '"]' + "\n" +
               'let $nextDlgItem := $mission/dialogitem[' + next_index + "]\n" +
               'let $dlgItem := $mission/dialogitem[' + params["index"] + "]\n" +
               'return (# exist:batch-transaction #) {' + "\n" +
               '  update insert $dlgItem following $nextDlgItem,' + "\n" +
               '  update delete $dlgItem' + "\n" +
               '}';
  end
end