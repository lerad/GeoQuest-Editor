require 'queries/query'

# Queries the files
# and returns the directionary as a tree
# important parameter:
# 'folder' (One subfolder, e.g. drawable)
# 'project_id' id of the project
# Works in: /projects/[project-id]/
class DirectoryQuery < Query
    def initialize(params)
      super(params)
      @type = "DirectoryQuery"
    end

    def execute()
      #Query::execute()
      text =  <<-EOF
 {
      data : {
          title : "node_title",
          icon : "folder"
          },
     children: [ /* an array of child nodes objects */ ]
 }
EOF
   
     text
    end
end