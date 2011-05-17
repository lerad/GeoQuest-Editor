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



function AddQuestionCommand() {
    this.setParameter("command", "AddQuestionCommand");

    this.updateGui = function() {
        var questionTable = $("#questionTable");
        var newRow = $(document.createElement("tr"))
                       .attr("class", "questionRow");
        var newCell = $(document.createElement("td"));
        var textArea = $(document.createElement("p"))
                            .text(this.getParameter("text"));

        var answerTable = $(document.createElement("table"))
                            .attr("class", "answerTable");
        answerTable.append($("<tr><td>Antwort</td><td>Reaktion</td></tr>"))
        var answerText = $(document.createElement("textarea"))
                            .attr("cols", "30")
                            .attr("rows", "4")
                            .attr("class", "newAnswerTextfield");
        var onChooseText = $(document.createElement("textarea"))
                            .attr("cols", "30")
                            .attr("rows", "4")
                            .attr("class", "newOnChooseTextfield");


        var answerButton = $(document.createElement("input"))
                                .attr("type", "button")
                                .attr("value", "Antwort hinzufügen")
                                .attr("onclick","addAnswer(this)");
        newCell.append($(document.createElement("hr")));
        newCell.append(textArea);
        newCell.append($(document.createElement("br")));
        newCell.append($(document.createElement("h4"))
                            .text("Antworten"));
        newCell.append(answerTable);
        newCell.append($(document.createElement("p")).text("Neue Antwort"));
        newCell.append(answerText);
        newCell.append($(document.createElement("p")).text("Text, wenn diese Antwort gewählt wird"));
        newCell.append(onChooseText);
        newCell.append(answerButton);

        newRow.append(newCell);
        questionTable.append(newRow);


    }
}

AddQuestionCommand.prototype = new Command();


function AddAnswerCommand() {
    this.setParameter("command", "AddAnswerCommand");

    this.updateGui = function() {
        var questionRow = $("#questionTable > tbody > tr").eq(this.getParameter("question_index"));
        var answerTable = questionRow.find("table.answerTable");


        var newRow = $(document.createElement("tr"));
        var newAnswerTd = $(document.createElement("td"))
                          .text(this.getParameter("answer"))
                          .attr("class", "answerCell");
        var newOnChooseTd = $(document.createElement("td"))
                          .text(this.getParameter("on_choose"))
                          .attr("class", "answerCell");
        newRow.append(newAnswerTd)
              .append(newOnChooseTd);
        answerTable.append(newRow);

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