class StarSystem < ApplicationRecord
  # Допустимые спектральные классы звёзд.
  STAR_TYPES = %w[O B A F G K M].freeze

  # Названия класса звезды для интерфейса.
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

  # Убираем пробелы в начале и конце названия.
  before_validation do
    self.name = name.strip if name.is_a?(String)
  end

  # Проверяем наличие названия и его длину.
  validates :name,
            presence: true,
            length: { in: 1..20 }

  # Запрещаем одинаковые названия систем у одного пользователя.
  validates :name,
            uniqueness: {
              scope: :user_id,
              case_sensitive: false,
              message: "уже используется другой звёздной системой"
            }

  # Проверяем допустимость спектрального класса звезды.
  validates :star_type,
            inclusion: { in: STAR_TYPES }

  def planet_count
    planets.count
  end
end