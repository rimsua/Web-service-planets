require "test_helper"

class PlanetTest < ActiveSupport::TestCase
  setup do
    @user = User.create!(
      nickname: "planetuser",
      email_address: "planet@example.com",
      password: "password"
    )

    @system = @user.star_systems.create!(name: "Test System")
  end

  test "habitable planet returns true" do
    planet = @system.planets.create!(
      name: "Earth",
      planet_type: "rocky",
      temperature: 288,
      atmosphere: "dense",
      water: true
    )

    assert planet.habitable?
  end

  test "planet without water is not habitable" do
    planet = @system.planets.create!(
      name: "Dry Planet",
      planet_type: "rocky",
      temperature: 288,
      atmosphere: "dense",
      water: false
    )

    assert_not planet.habitable?
  end

  test "temperature category is determined correctly" do
    planet = @system.planets.create!(
      name: "Cold Planet",
      planet_type: "ice",
      temperature: 200,
      atmosphere: "thin",
      water: false
    )

    assert_equal :cold, planet.temperature_category
  end

  test "gas planet is not habitable" do
    planet = @system.planets.create!(
      name: "Jupiter",
      planet_type: "gas",
      temperature: 288,
      atmosphere: "dense",
      water: true
    )

    assert_not planet.habitable?
  end

  test "planet without an atmosphere is not habitable" do
    planet = @system.planets.create!(
      name: "Airless",
      planet_type: "rocky",
      temperature: 288,
      atmosphere: "none",
      water: true
    )

    assert_not planet.habitable?
  end

  test "temperatures at both limits meet the habitability criteria" do
    [253, 313].each do |temperature|
      planet = @system.planets.new(
        name: "Boundary #{temperature}",
        planet_type: "rocky",
        temperature: temperature,
        atmosphere: "dense",
        water: true
      )

      assert planet.habitable?,
            "Temperature #{temperature} K should meet the criteria"
    end
  end

  test "temperatures outside the limits do not meet the criteria" do
    [252, 314].each do |temperature|
      planet = @system.planets.new(
        name: "Outside #{temperature}",
        planet_type: "rocky",
        temperature: temperature,
        atmosphere: "dense",
        water: true
      )

      assert_not planet.habitable?,
                  "Temperature #{temperature} K should not meet the criteria"
    end
  end

  test "ocean planet can meet the habitability criteria" do
    planet = @system.planets.new(
      name: "Ocean World",
      planet_type: "ocean",
      temperature: 288,
      atmosphere: "thin",
      water: true
    )

    assert planet.habitable?
  end

  test "planets in different systems can have the same name" do
    first_planet = @system.planets.create!(
      name: "Earth",
      planet_type: "rocky",
      temperature: 288,
      atmosphere: "dense",
      water: true
    )

    another_system = @user.star_systems.create!(
      name: "Alpha"
    )

    second_planet = another_system.planets.new(
      name: "Earth",
      planet_type: "rocky",
      temperature: 288,
      atmosphere: "dense",
      water: true
    )

    assert first_planet.persisted?
    assert second_planet.valid?
  end

  test "a system cannot have planets with duplicate names ignoring case" do
    @system.planets.create!(
      name: "Earth",
      planet_type: "rocky",
      temperature: 288,
      atmosphere: "dense",
      water: true
    )

    duplicate = @system.planets.new(
      name: "earth",
      planet_type: "rocky",
      temperature: 288,
      atmosphere: "dense",
      water: true
    )

    assert_not duplicate.valid?
    assert_includes duplicate.errors.attribute_names, :name
  end

  test "spaces around a planet name are removed" do
    planet = @system.planets.new(
      name: "  New World  ",
      planet_type: "rocky",
      temperature: 288,
      atmosphere: "dense",
      water: true
    )

    assert planet.valid?
    assert_equal "New World", planet.name
  end
end