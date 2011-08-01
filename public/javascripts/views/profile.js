$(document).ready(function() {
   $("#editName").editable("/ajax/updateUserProperties");
   $("#editEmail").editable("/ajax/updateUserProperties");
});

$(document).ready(function() {
   $("#updatePasswordButton").click(function() {
     var password = $("#editPassword").val();
     var confirm = $("#confirmNewPassword").val();
     if (password != confirm) {
         $("#passwordChangeResult").removeClass("success")
                                   .addClass("failure")
                                   .text("Password and confirmation does not match");
         return;
     }
     $.ajax({
         url: "/ajax/updateUserProperties",
         data : {
             id : "editPassword",
             value : password
         },
         success : function() {
              $("#passwordChangeResult")
                        .removeClass("failure")
                        .addClass("success")
                        .text("Password successfully changed");
         },
         error : function() {
               $("#passwordChangeResult")
                        .removeClass("success")
                        .addClass("failure")
                        .text("Error during password change");
         }
     })
   });
});