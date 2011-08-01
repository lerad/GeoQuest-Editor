class ProfileController < ApplicationController
  before_filter :authenticate

  def show
  end

  def update_user_properties
     case params[:id]
     when "editName"

         # Rename repository:
         adapter = ExistAdapter.new("global")
         old_name = @current_user.name
         new_name = params[:value]
         request_template = ERB.new <<-EOF
            let $repository := doc("repository.xml")//repository[@name="<%= old_name %>"]
            return update insert attribute name{"<%= new_name %>"} into  $repository
          EOF
         request = request_template.result(binding)
         Rails.logger.info("Change repository name: ")
         Rails.logger.info(request)
         adapter.do_request(request)

         @current_user.name = params[:value]

         unless @current_user.save
           render :status => 500, :text => "Changing user name failed"
           return
         end
     when "editEmail"
         @current_user.email = params[:value]
         unless @current_user.save
           render :status => 500, :text => "Changing user email failed"
           return
         end
     when "editPassword"
        @current_user.password = params[:value]
        unless @current_user.save
          render :status => 500, :text => "Password change failed"
        end
     else
       render :status => 500, :text => "Unsupported property: " + params[:id]
       return
     end
     render :text => params[:value]
  end


end
