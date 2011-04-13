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

function addQuestion() {
 cmd = new AddQuestionCommand();
 cmd.setParameter("mission_id", mission_id);
 cmd.setParameter("project_id", project_id);
 cmd.setParameter("text", $("#newQuestionText").val());
 cmd.execute();
}

function addAnswer(button) {
 var row = $(button).parents(".questionRow");
 var question_index = row.attr("rowIndex");
 var onChoose = row.find(".newOnChooseTextfield").val();
 var answer = row.find(".newAnswerTextfield").val();

 var cmd = new AddAnswerCommand();
 cmd.setParameter("mission_id", mission_id);
 cmd.setParameter("project_id", project_id);
 cmd.setParameter("question_index", question_index);
 cmd.setParameter("answer", answer);
 cmd.setParameter("on_choose", onChoose);
 cmd.execute();
}