/**
 * Copyright 2011, Folker Hoffmann
 * Licensed under the MIT license
 * See http://www.opensource.org/licenses/mit-license.php
 */
$(document).ready(function() {
    $( "#accordion" ).accordion({collapsible: true, animated: false, active: false});
});

$(document).ready(function() {
  $('.editable-question').editable(editQuestionText, {type: 'text'} );
  $('.editable-answer').editable(editAnswerText, {type: 'text'});
  $('.editable-onchoose').editable(editOnChooseText, {type : 'text'});
  $('.checkbox-correct').change(onCorrectnessChange);
  $("#editNeededAnswers").editable(editOnNeededAnswerChange);
});

function editOnNeededAnswerChange(value, settings) {
    cmd = new UpdateAttributeInMissionCommand();
    cmd.setParameter("project_id", project_id);
    cmd.setParameter("mission_id", mission_id);
    cmd.setParameter("attribute", "correctAnswersNeeded");
    cmd.setParameter("value", value);
    cmd.execute();
    return value;
}


function addIntro() {
  cmd = new AddQuestionAndAnswerIntro();
  cmd.setParameter("mission_id", mission_id);
  cmd.setParameter("project_id", project_id);
  cmd.execute();
}

function addOutroSuccess() {
  cmd = new AddQuestionAndAnswerOutroSuccess();
  cmd.setParameter("mission_id", mission_id);
  cmd.setParameter("project_id", project_id);
  cmd.execute();
}

function addOutroFail() {
  cmd = new AddQuestionAndAnswerOutroFail();
  cmd.setParameter("mission_id", mission_id);
  cmd.setParameter("project_id", project_id);
  cmd.execute();
}

function updateIntro() {
  cmd = new UpdateQuestionAndAnswerIntro()
  cmd.setParameter("mission_id", mission_id);
  cmd.setParameter("project_id", project_id);
  cmd.setParameter("value", $("#intro").val());
  cmd.execute();
}

function updateOutroSuccess() {
  cmd = new UpdateQuestionAndAnswerOutroSuccess()
  cmd.setParameter("mission_id", mission_id);
  cmd.setParameter("project_id", project_id);
  cmd.setParameter("value", $("#outroSuccess").val());
  cmd.execute();
}

function updateOutroFail() {
  cmd = new UpdateQuestionAndAnswerOutroFail()
  cmd.setParameter("mission_id", mission_id);
  cmd.setParameter("project_id", project_id);
  cmd.setParameter("value", $("#outroFail").val());
  cmd.execute();
}

function deleteIntro() {
  cmd = new DeleteQuestionAndAnswerIntro();
  cmd.setParameter("mission_id", mission_id);
  cmd.setParameter("project_id", project_id);
  var really = confirm("Intro wirklich löschen?");
  if(really) {
      cmd.execute();
  }
}

function deleteOutroSuccess() {
  cmd = new DeleteQuestionAndAnswerOutroSuccess();
  cmd.setParameter("mission_id", mission_id);
  cmd.setParameter("project_id", project_id);
  var really = confirm("Outro (Success) wirklich löschen?");
  if(really) {
      cmd.execute();
  }
}

function deleteOutroFail() {
  cmd = new DeleteQuestionAndAnswerOutroFail();
  cmd.setParameter("mission_id", mission_id);
  cmd.setParameter("project_id", project_id);
  var really = confirm("Outro (Fail) wirklich löschen?");
  if(really) {
      cmd.execute();
  }
}

function deleteQuestion() {
 var question_index = $('#accordion').accordion('option', 'active');
     cmd = new DeleteQuestionCommand();
     cmd.setParameter("mission_id", mission_id);
     cmd.setParameter("project_id", project_id);
     cmd.setParameter("question_index", question_index);
     cmd.execute();
}

function deleteAnswer(button) {
 var question_index = $('#accordion').accordion('option', 'active');

 // Determine index of the modified answer:
 var row = $(button).parents("tr").eq(0);
 var tbody = row.parent("tbody");
 var answer = tbody.children().index(row);
 answer -= 1; // Header row

 var cmd = new DeleteAnswerCommand();
 cmd.setParameter("mission_id", mission_id);
 cmd.setParameter("project_id", project_id);
 cmd.setParameter("question_index", question_index);
 cmd.setParameter("answer_index", answer);
 cmd.execute();
}

function addQuestion() {
 cmd = new AddQuestionCommand();
 cmd.setParameter("mission_id", mission_id);
 cmd.setParameter("project_id", project_id);
 cmd.setParameter("text", $("#newQuestionText").val());
 cmd.execute();
}

function addAnswer() {

 var question_index = $('#accordion').accordion('option', 'active');
 var answer =  $("div.ui-accordion-content-active > input.newAnswerTextfield").val();
 var onChoose = $("div.ui-accordion-content-active > input.newOnChooseTextfield").val();
 var correctCheckbox = $("div.ui-accordion-content-active").find("#newCorrectCheckbox").attr("checked");
 var correct = "0";
 if(correctCheckbox) correct = "1";

 var cmd = new AddAnswerCommand();
 cmd.setParameter("mission_id", mission_id);
 cmd.setParameter("project_id", project_id);
 cmd.setParameter("correct", correct);
 cmd.setParameter("question_index", question_index);
 cmd.setParameter("answer", answer);
 cmd.setParameter("on_choose", onChoose);
 cmd.execute();
}


function editQuestionText(value, settings) {

    // Current open question:
    var question_index = $('#accordion').accordion('option', 'active');

    var cmd = new UpdateQuestionTextCommand();
    cmd.setParameter("mission_id", mission_id);
    cmd.setParameter("project_id", project_id);
    cmd.setParameter("question_index", question_index);
    cmd.setParameter("value", value);
    cmd.execute();

    return value ;
}



function editAnswerText(value, settings) {
    // Current open question:
    var question_index = $('#accordion').accordion('option', 'active');


    // Determine index of the modified answer:
    var active = $('#accordion').accordion('option', 'active');
    var row = $(this).parents("tr").eq(0);
    var tbody = row.parent("tbody");
    var answer = tbody.children().index(row);
    answer -= 1; // Header row

    var cmd = new UpdateAnswerTextCommand();
    cmd.setParameter("mission_id", mission_id);
    cmd.setParameter("project_id", project_id);
    cmd.setParameter("value", value);
    cmd.setParameter("answer_index", answer);
    cmd.setParameter("question_index", question_index);
    cmd.execute();

    return value ;
}

function onCorrectnessChange() {
    // Current open question:
    var question_index = $('#accordion').accordion('option', 'active');



    // Determine index of the modified answer:
    var active = $('#accordion').accordion('option', 'active');
    var row = $(this).parents("tr").eq(0);
    var tbody = row.parent("tbody");
    var answer = tbody.children().index(row);
    answer -= 1; // Header row

    var value = "0";
    if ($(this).attr("checked")) {
        value = "1";
    }

    var cmd = new UpdateAnswerCorrectCommand();
    cmd.setParameter("mission_id", mission_id);
    cmd.setParameter("project_id", project_id);
    cmd.setParameter("value", value);
    cmd.setParameter("answer_index", answer);
    cmd.setParameter("question_index", question_index);
    cmd.execute();

    return value ;
}



function editOnChooseText(value, settings) {

    // Current open question:
    var question_index = $('#accordion').accordion('option', 'active');

    // Determine index of the modified answer:
    var active = $('#accordion').accordion('option', 'active');
    var row = $(this).parents("tr").eq(0);
    var tbody = row.parent("tbody");
    var answer = tbody.children().index(row);
    answer -= 1; // Header row

    var cmd = new UpdateAnswerOnChooseTextCommand();
    cmd.setParameter("mission_id", mission_id);
    cmd.setParameter("project_id", project_id);
    cmd.setParameter("value", value);
    cmd.setParameter("answer_index", answer);
    cmd.setParameter("question_index", question_index);
    cmd.execute();

    return value ;
}