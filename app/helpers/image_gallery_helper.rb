# Copyright 2011, Folker Hoffmann
# Licensed under the MIT license
# See http://www.opensource.org/licenses/mit-license.php

module ImageGalleryHelper
  def list_image_directories(id)

    path =Rails.root.join("public", "projects", id.to_s, "drawable")

    # DFS search
    stack= ["/"]
    dirs = []

    while stack.size() > 0 do
      dir = stack.pop()
      if dir == "/" then
        dirs += [dir]
      else
        dirs += [dir.chop()] #remove last "/"
      end
      Dir.chdir(path.to_s + dir)
      Dir.glob("*") {|x|
        if File.directory?(x) then
            stack.push(dir + File.basename(x).to_s + "/")
        end
      }
    end

    dirs
  end
end
