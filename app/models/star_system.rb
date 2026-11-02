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
  # Отправление изменения публичной системы после сохранения
  after_commit :broadcast_public_state, on: [:create, :update]

  # Отправление события удаления после уничтожения системы
  after_destroy_commit :broadcast_public_removal
  
  scope :published, -> { where(published: true) }

  # Убираем пробелы в начале и конце названия
  before_validation do
    self.name = name.strip if name.is_a?(String)
  end

  # Проверка наличия названия и его длины
  validates :name,
            presence: true,
            length: { in: 1..15 }

  # Запрет одинаковых названий систем у одного пользователя
  validates :name,
            uniqueness: {
              scope: :user_id,
              case_sensitive: false,
              message: "уже используется другой звёздной системой"
            }

  # Проверка допустимости спектрального класса звезды
  validates :star_type,
            inclusion: { in: STAR_TYPES }

  def planet_count
    planets.count
  end

  private

  def broadcast_public_state
    if published?
      UniverseBroadcaster.upsert(self)
    elsif saved_change_to_published? &&
          saved_change_to_published == [true, false]
      UniverseBroadcaster.remove(id)
    end
  end

  def broadcast_public_removal
    UniverseBroadcaster.remove(id) if published?
  end
end