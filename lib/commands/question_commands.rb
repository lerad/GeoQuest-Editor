# Copyright 2011, Folker Hoffmann
# Licensed under the MIT license
# See http://www.opensource.org/licenses/mit-license.php

require 'commands/command'

class AddQuestionCommand < Command
  def initialize(params)
    super(params)
    @type = "AddQuestionCommand"

    template = ERB.new <<-EOF
let $mission := doc("game.xml")//mission[@id="<%= params["mission_id"] %>"]
let $question := <question><questiontext><%= params["text"] %></questiontext></question>

return update insert $question into $mission
EOF
    @command = template.result(binding);
  end
end


class AddAnswerCommand < Command
  def initialize(params)
    super(params)
    @type = "AddQuestionCommand"

    # Conversion to exist numbering sheme
    # Probably i should look for a nicer solution
    # as e.g. a method in all Javascript COmmand objects
    # which does some preprocession
    index = params["question_index"].to_i + 1


    template = ERB.new <<-EOF
let $mission := doc("game.xml")//mission[@id="<%= params["mission_id"] %>"]
let $question := $mission/question[<%= index %>]
let $answer := <answer correct="<%= params["correct"] %>" onChoose="<%= params["on_choose"] %>"><%= params["answer"] %></answer>
return update insert $answer into $question
EOF
    @command = template.result(binding);
  end
end






class UpdateQuestionTextCommand < Command
  def initialize(params)
    super(params)
    @type = "UpdateQuestionTextCommand"

    template = ERB.new <<-EOF
let $node := doc("game.xml")//mission[@id="<%= params["mission_id"] %>"]/question[<%= params[:xquery_question_index] %>]/questiontext
return  update value $node with "<%= params["value"] %>"
EOF

    @command = template.result(binding)

  end
end


class UpdateAnswerTextCommand < Command
  def initialize(params)
    super(params)
    @type = "UpdateAnswerTextCommand"

    template = ERB.new <<-EOF
let $node := doc("game.xml")//mission[@id="<%= params["mission_id"] %>"]/question[<%= params[:xquery_question_index] %>]/answer[<%= params[:xquery_answer_index] %>]
return  update value $node with "<%= params["value"] %>"
EOF

    @command = template.result(binding)

  end
end

class UpdateAnswerOnChooseTextCommand < Command
  def initialize(params)
    super(params)
    @type = "UpdateAnswerOnChooseTextCommand"

    template = ERB.new <<-EOF
let $node := doc("game.xml")//mission[@id="<%= params["mission_id"] %>"]/question[<%= params[:xquery_question_index] %>]/answer[<%= params[:xquery_answer_index] %>]
return  update value $node/@onChoose with "<%= params["value"] %>"
EOF

    @command = template.result(binding)

  end
end

class UpdateAnswerCorrectCommand < Command
  def initialize(params)
    super(params)
    @type = "UpdateAnswerCorrectCommand"

    template = ERB.new <<-EOF
let $node := doc("game.xml")//mission[@id="<%= params["mission_id"] %>"]/question[<%= params[:xquery_question_index] %>]/answer[<%= params[:xquery_answer_index] %>]
return  update value $node/@correct with "<%= params["value"] %>"
EOF

    @command = template.result(binding)

  end
end


class DeleteQuestionCommand < Command
  def initialize(params)
    super(params)
    @type = "DeleteQuestionCommand"

    template = ERB.new <<-EOF
let $node := doc("game.xml")//mission[@id="<%= params[:mission_id] %>"]/question[<%= params[:xquery_question_index] %>]
return update delete $node
EOF

    @command = template.result(binding)

  end
end


class DeleteAnswerCommand < Command
  def initialize(params)
    super(params)
    @type = "DeleteAnswerCommand"

    template = ERB.new <<-EOF
let $node := doc("game.xml")//mission[@id="<%= params[:mission_id] %>"]/question[<%= params[:xquery_question_index] %>]/answer[<%= params[:xquery_answer_index] %>]
return update delete $node
EOF

    @command = template.result(binding)

  end
end

