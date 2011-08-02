# Copyright 2011, Folker Hoffmann
# Licensed under the MIT license
# See http://www.opensource.org/licenses/mit-license.php

require 'digest'

class User < ActiveRecord::Base
  attr_accessor :password

  validates   :email, :uniqueness => true,
              :format => {:with => /^[^@][\w.-]+@[\w.-]+[.][a-z]{2,4}$/i } 

  validates :password, :confirmation => true,
    :length => { :within => 4..20 },
    :presence => true,
    :if => :password_required?

  has_many :projects

  before_save :hash_new_password

  def self.authenticate(email, pass)
      user = find_by_email(email)
      return user if user && user.authenticated?(pass)
  end

  def authenticated?(pass)
    self.password_hashed == hash(pass)
  end

   def password_required?
     # Entry is either new (password_hashed is blank)
     # or changed (Then password is present)
     # This are the only cases, where validation is necessary
     password_hashed.blank? || password.present?
   end

   def hash_new_password
     return if password.blank?
     self.password_hashed = hash(password)
   end


   def hash(string)
     Digest::SHA1.hexdigest(string)
   end


end
