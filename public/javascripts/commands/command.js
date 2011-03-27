// Prototype for all Javascript Command Objects:

function Command() {
    this.parameter = new Object();

    this.setParameter = function(key, value) {
        this.parameter[key] = value;
    }

    this.makeAjaxCall = function()  {

        // Create a string like
        // "id=[value]&latitude=[value]&longitude=[value]&command=[value]&"
        // the extra & at the end should not harm
        // Note: The parameter string also include the command's name
        var parameter_string = "";
        for (var key in this.parameter) {
            parameter_string += key;
            parameter_string += "=";
            parameter_string += this.parameter[key];
            parameter_string += "&";
        }

         jQuery.post("/commands/execute", parameter_string);
    }
}