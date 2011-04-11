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

