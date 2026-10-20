class Planet < ApplicationRecord
  PLANET_TYPES = %w[rocky gas ice ocean lava].freeze
  ATMOSPHERES = %w[none thin dense].freeze
  HABITABLE_TYPES = %w[rocky ocean].freeze
  HABITABLE_TEMPERATURE = 253..313

  belongs_to :star_system

  before_validation do
    self.name = name.strip if name.is_a?(String)
  end

  validates :name,
            presence: true,
            length: { in: 1..15 }
  
  validates :name,
          uniqueness: {
            scope: :star_system_id,
            case_sensitive: false,
            message: "уже используется другой планетой в этой системе"
          }

  validates :planet_type,
            inclusion: { in: PLANET_TYPES }

  validates :temperature,
            numericality: {
              only_integer: true,
              greater_than_or_equal_to: 0
            }

  validates :atmosphere,
            inclusion: { in: ATMOSPHERES }

  validates :water,
            inclusion: { in: [true, false] }

  def habitable?
    HABITABLE_TYPES.include?(planet_type) &&
      atmosphere != "none" &&
      water &&
      HABITABLE_TEMPERATURE.cover?(temperature)
  end

  def temperature_category
    case temperature
    when 0...273
      :cold
    when 273..313
      :temperate
    else
      :hot
    end
  end
end