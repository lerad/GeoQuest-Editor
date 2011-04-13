function addMission() {
    var id = prompt("Mission id");
    if(id == '' || id == null) return;
    // TODO: Check if this id is used
    var type = $('#missionType').val();

    cmd = new AddMissionCommand();
    cmd.setParameter("project_id", project_id);
    cmd.setParameter("new_mission_id", id);
    cmd.setParameter("new_mission_type", type);
    cmd.execute();
}