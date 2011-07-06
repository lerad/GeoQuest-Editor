// Prototype for all Javascript Command Objects:

function Command() {
    this.parameter = new Object();

    this.setParameter = function(key, value) {
        this.parameter[key] = value;
    }

    this.getParameter = function(key) {
        return this.parameter[key];
    }

    this.execute = function() {

        if(this.preExecute) {
            this.preExecute();
        }

        this.updateGui();
        this.makeAjaxCall();
    }

    this.onSuccess = function() {
        
    }

    this.onFailure = function(jqXHR, textStatus, errorThrown) {
        /**
         * If the user clicks reload, during an ajax call an error is thrown
         * The following conditions checks for this
         * Such errors need not to be presented to the user
         */
        if(jqXHR.readyState == 0 || jqXHR.status == 0)
            return;
        // By default show error (maybe do something more silent later)
        alert("Error during AJAX: " + errorThrown);
    }


    this.makeAjaxCall = function()  {
        // Create a string like
        // "id=[value]&latitude=[value]&longitude=[value]&command=[value]&"
        // the extra & at the end should not harm
        // Note: The parameter string also include the command's name
        // var parameter_string = "";
        // for (var key in this.parameter) {
        //    parameter_string += key;
        //    parameter_string += "=";
        //    parameter_string += this.parameter[key];
        //    parameter_string += "&";
        //}

        jQuery.ajax({
            url : "/commands/execute",
            success : this.onSuccess,
            error : this.onFailure,
            data : this.parameter,
            type : "POST"
        })

        // jQuery.post("/commands/execute", parameter_string);
        
    }
}