class StarSystem < ApplicationRecord
  belongs_to :user
  has_many :planets, dependent: :destroy

  validates :name,
            presence: true,
            length: { in: 1..50 }

  def planet_count
    planets.count
  end
end