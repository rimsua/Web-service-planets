class User < ApplicationRecord
  MAX_STAR_SYSTEMS = 10

  has_secure_password

  has_many :sessions, dependent: :destroy
  has_many :star_systems, dependent: :destroy

  normalizes :email_address, with: ->(email) { email.strip.downcase }

  validates :nickname,
            presence: true,
            uniqueness: true,
            length: { in: 5..30 }

  validates :email_address,
            presence: true,
            uniqueness: true,
            format: { with: URI::MailTo::EMAIL_REGEXP }

  validates :password,
            length: { minimum: 6 },
            if: -> { password.present? }

  def can_create_star_system?
    star_systems.count < MAX_STAR_SYSTEMS
  end
end