function AddQuestionAndAnswerIntro() {

    // As this command does not need specific Xml commands
    // AddXmlNodeToMission is a generic Command
    this.setParameter("command", "AddXmlNodeToMission");
    this.setParameter("node", "intro")


    this.updateGui = function()  {
        var tdTextarea = $("#introPlace");
        tdTextarea.children().remove();
        var newTextArea = $(document.createElement('textarea'));
        newTextArea.attr("id","intro")
                   .attr("cols","30")
                   .attr("rows","3");
        tdTextarea.append(newTextArea);
        
        var newUpdateButton = $(document.createElement('input'))
                                .attr("type","button")
                                .attr("value", "Intro aktualisieren")
                                .attr("onclick", "updateIntro()");

        var newDeleteButton = $(document.createElement('input'))
                                .attr("type","button")
                                .attr("value", "Intro löschen")
                                .attr("onclick", "deleteIntro()");



        $("#introButtonPlace").append(newUpdateButton);
        $("#introButtonPlace").append($(document.createElement('br')));
        $("#introButtonPlace").append(newDeleteButton);

    }
}

AddQuestionAndAnswerIntro.prototype = new Command();


function AddQuestionAndAnswerOutroSuccess() {

    // As this command does not need specific Xml commands
    // AddXmlNodeToMission is a generic Command
    this.setParameter("command", "AddXmlNodeToMission");
    this.setParameter("node", "outroSuccess")



    this.updateGui = function()  {
        var tdTextarea = $("#outroSuccessPlace");
        tdTextarea.children().remove();
        var newTextArea = $(document.createElement('textarea'));
        newTextArea.attr("id","outroSuccess")
                   .attr("cols","30")
                   .attr("rows","3");
        tdTextarea.append(newTextArea);

        var newUpdateButton = $(document.createElement('input'))
                                .attr("type","button")
                                .attr("value", "Outro (Success) aktualisieren")
                                .attr("onclick", "updateOutroSuccess()");

        var newDeleteButton = $(document.createElement('input'))
                                .attr("type","button")
                                .attr("value", "Outro (Success) löschen")
                                .attr("onclick", "deleteOutroSuccess()");



        $("#outroSuccessButtonPlace").append(newUpdateButton);
        $("#outroSuccessButtonPlace").append($(document.createElement('br')));
        $("#outroSuccessButtonPlace").append(newDeleteButton);
    }
}

AddQuestionAndAnswerOutroSuccess.prototype = new Command();


function AddQuestionAndAnswerOutroFail() {

    // As this command does not need specific Xml commands
    // AddXmlNodeToMission is a generic Command
    this.setParameter("command", "AddXmlNodeToMission");
    this.setParameter("node", "outroFail")



    this.updateGui = function()  {
        var tdTextarea = $("#outroFailPlace");
        tdTextarea.children().remove();
        var newTextArea = $(document.createElement('textarea'));
        newTextArea.attr("id","outroFail")
                   .attr("cols","30")
                   .attr("rows","3");
        tdTextarea.append(newTextArea);


        var newUpdateButton = $(document.createElement('input'))
                                .attr("type","button")
                                .attr("value", "Outro (Fail) aktualisieren")
                                .attr("onclick", "updateOutroFail()");

        var newDeleteButton = $(document.createElement('input'))
                                .attr("type","button")
                                .attr("value", "Outro (Fail) löschen")
                                .attr("onclick", "deleteOutroFail()");



        $("#outroFailButtonPlace").append(newUpdateButton);
        $("#outroFailButtonPlace").append($(document.createElement('br')));
        $("#outroFailButtonPlace").append(newDeleteButton);
    }
}

AddQuestionAndAnswerOutroFail.prototype = new Command();



function UpdateQuestionAndAnswerIntro() {

    // As this command does not need specific Xml commands
    // UpdateXmlNodeContentInMission is a generic Command
    this.setParameter("command", "UpdateXmlNodeContentInMission");
    this.setParameter("node", "intro")

    this.updateGui = function()  {

    }
}

UpdateQuestionAndAnswerIntro.prototype = new Command();


function UpdateQuestionAndAnswerOutroSuccess() {

    // As this command does not need specific Xml commands
    // UpdateXmlNodeContentInMission is a generic Command
    this.setParameter("command", "UpdateXmlNodeContentInMission");
    this.setParameter("node", "outroSuccess")

    this.updateGui = function()  {

    }
}

UpdateQuestionAndAnswerOutroSuccess.prototype = new Command();

function UpdateQuestionAndAnswerOutroFail() {

    // As this command does not need specific Xml commands
    // UpdateXmlNodeContentInMission is a generic Command
    this.setParameter("command", "UpdateXmlNodeContentInMission");
    this.setParameter("node", "outroFail")

    this.updateGui = function()  {

    }
}

UpdateQuestionAndAnswerOutroFail.prototype = new Command();


function DeleteQuestionAndAnswerIntro() {
    // As this command does not need specific Xml commands
    // DeleteXmlNodeFromMission is a generic Command
    this.setParameter("command", "DeleteXmlNodeFromMission");
    this.setParameter("node", "intro")

    this.updateGui = function()  {
        // Clear cell:
        $("#introPlace").children().remove();
        $("#introButtonPlace").children().remove();

        var newButton = $(document.createElement('input'));
        newButton.attr("type","button")
                 .attr("value", "Add Intro")
                 .attr("onclick", "addIntro()");

        $("#introPlace").append(newButton);
    }
}

DeleteQuestionAndAnswerIntro.prototype = new Command();



function DeleteQuestionAndAnswerOutroSuccess() {
    // As this command does not need specific Xml commands
    // DeleteXmlNodeFromMission is a generic Command
    this.setParameter("command", "DeleteXmlNodeFromMission");
    this.setParameter("node", "outroSuccess")

    this.updateGui = function()  {
        // Clear cell:
        $("#outroSuccessPlace").children().remove();
        $("#outroSuccessButtonPlace").children().remove();

        var newButton = $(document.createElement('input'));
        newButton.attr("type","button")
                 .attr("value", "Add Outro (Success)")
                 .attr("onclick", "addOutroSuccess()");

        $("#outroSuccessPlace").append(newButton);
    }
}

DeleteQuestionAndAnswerOutroSuccess.prototype = new Command();



function DeleteQuestionAndAnswerOutroFail() {
    // As this command does not need specific Xml commands
    // DeleteXmlNodeFromMission is a generic Command
    this.setParameter("command", "DeleteXmlNodeFromMission");
    this.setParameter("node", "outroFail")

    this.updateGui = function()  {
        // Clear cell:
        $("#outroFailPlace").children().remove();
        $("#outroFailButtonPlace").children().remove();

        var newButton = $(document.createElement('input'));
        newButton.attr("type","button")
                 .attr("value", "Add Outro (Fail)")
                 .attr("onclick", "addOutroFail()");

        $("#outroFailPlace").append(newButton);
    }
}

DeleteQuestionAndAnswerOutroFail.prototype = new Command();

function UpdateAnswerTextCommand() {
    this.setParameter("command", "UpdateAnswerTextCommand");

    this.updateGui = function()  { }
    this.preExecute = function() {
        var answer_index = this.getParameter("answer_index");
        this.setParameter("xquery_answer_index", answer_index + 1);
        var question_index = this.getParameter("question_index");
        this.setParameter("xquery_question_index", question_index + 1);
    }
}

UpdateAnswerTextCommand.prototype = new Command();


function UpdateAnswerOnChooseTextCommand() {
    this.setParameter("command", "UpdateAnswerOnChooseTextCommand");

    this.updateGui = function()  { }
    this.preExecute = function() {
        var answer_index = this.getParameter("answer_index");
        this.setParameter("xquery_answer_index", answer_index + 1);
        var question_index = this.getParameter("question_index");
        this.setParameter("xquery_question_index", question_index + 1);
    }
}

UpdateAnswerOnChooseTextCommand.prototype = new Command();




function AddQuestionCommand() {
    this.setParameter("command", "AddQuestionCommand");

    this.updateGui = function() {


     var newQuestionHtml = '\
            <h3><a href="#">' + this.getParameter("text") +  '</a></h3> \
            <div> \
                Frage: <div class="editable-question">' + this.getParameter("text") + '</div> <br /> \
                <input type="button" onclick="deleteQuestion()" value="Frage löschen" /> \
                <br /> \
                <table class="answerTable"> \
                    <tr><td>Antwort</td><td>Reaktion</td></tr> \
                </table> \
                <p>Neue Antwort</p> \
                <textarea class="newAnswerTextfield" cols="30" rows="4"></textarea> \
                <p>Text, wenn diese Antwort gewählt wird</p> \
                <textarea class="newOnChooseTextfield" cols="30" rows="4"></textarea> \
                <br /> \
                <input type="button" value="Antwort hinzufügen" onclick="addAnswer()" /> \
            </div>';


        $("#accordion").append(newQuestionHtml).accordion("destroy").accordion({collapsible: true, animated: false, active: false});

        $('.editable-question').editable("destroy")
        $('.editable-question').editable(editQuestionText, { type: 'text'});

    }
}

AddQuestionCommand.prototype = new Command();


function AddAnswerCommand() {
    this.setParameter("command", "AddAnswerCommand");

    this.updateGui = function() {
        var answerTable = $("div.ui-accordion-content-active > table.answerTable");

        var newRowHtml = '<tr>  \
                            <td class="answerCell"> \
                               <div class="editable-answer">' + this.getParameter("answer") + '</div> \
                            </td> \
                            <td class="answerCell"> \
                               <div class="editable-onchoose">' + this.getParameter("on_choose") + '</div> \
                            </td> \
                            <td> \
                               <input type="image" src="/images/delete.png" value="Delete" onclick="deleteAnswer(this)" /> \
                            </td> \
                          </tr>';


        var newRow = $(newRowHtml)

        answerTable.append(newRow);

        $('.editable-answer').editable("destroy")
        $('.editable-answer').editable("destroy")
        $('.editable-answer').editable(editAnswerText, { type: 'text'});
        $('.editable-onchoose').editable(editOnChooseText, {type : 'text'});

    }
}

AddAnswerCommand.prototype = new Command();




function UpdateQuestionTextCommand() {
    this.setParameter("command", "UpdateQuestionTextCommand");

    this.updateGui = function() {
        var index = this.getParameter("question_index");
        var question_text = this.getParameter("value");
          $("h3.ui-accordion-header > a").eq(index).text(question_text);
    }

    this.preExecute = function() {
        var index = this.getParameter("question_index");
        this.setParameter("xquery_question_index", index + 1);
    }
}

UpdateQuestionTextCommand.prototype = new Command();




function DeleteQuestionCommand() {
    this.setParameter("command", "DeleteQuestionCommand");

    this.updateGui = function() {
          $("h3.ui-state-active").remove();
          $("div.ui-accordion-content-active").remove();
         $("#accordion").accordion("destroy").accordion();
    }

    this.preExecute = function() {
        var index = this.getParameter("question_index");
        this.setParameter("xquery_question_index", index + 1);
    }
}

DeleteQuestionCommand.prototype = new Command();

function DeleteAnswerCommand() {
    this.setParameter("command", "DeleteAnswerCommand");

    this.updateGui = function() {
        var table = $("div.ui-accordion-content-active > table.answerTable");
        var row = table.find("tr").eq(this.getParameter("answer_index") + 1); // + 1 because of the header row
        row.remove();
    }

    this.preExecute = function() {
        var index = this.getParameter("question_index");
        this.setParameter("xquery_question_index", index + 1);
        answer_index = this.getParameter("answer_index");
        this.setParameter("xquery_answer_index", answer_index + 1);
    }
}

DeleteAnswerCommand.prototype = new Command();
