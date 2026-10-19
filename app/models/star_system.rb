class StarSystem < ApplicationRecord
  # Допустимые спектральные классы звёзд.
  STAR_TYPES = %w[O B A F G K M].freeze

  # названия класса звезды для интерфейса
  STAR_TYPE_LABELS = {
    "O" => "Голубая, очень горячая",
    "B" => "Голубовато-белая",
    "A" => "Белая",
    "F" => "Жёлто-белая",
    "G" => "Жёлтая, как Солнце",
    "K" => "Оранжевая",
    "M" => "Красная"
  }.freeze

  belongs_to :user
  has_many :planets, dependent: :destroy

  validates :name,
            presence: true,
            length: { in: 1..20 }

  validates :star_type,
            inclusion: { in: STAR_TYPES }

  def planet_count
    planets.count
  end
end