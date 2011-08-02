/**
 * Copyright 2011, Folker Hoffmann
 * Licensed under the MIT license
 * See http://www.opensource.org/licenses/mit-license.php
 */
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
        document.location.reload();
    }


    this.makeAjaxCall = function()  {

        jQuery.ajax({
            url : "/commands/execute",
            success : this.onSuccess,
            error : this.onFailure,
            data : this.parameter,
            type : "POST"
        });

        
    }
}