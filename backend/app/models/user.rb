class User < ApplicationRecord
  has_secure_password

  validates :email, presence: true, uniqueness: { case_sensitive: false }

  normalizes :email, with: ->(email) { email.strip.downcase }
end
