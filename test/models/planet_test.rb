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

    assert_equal "cold", planet.temperature_category
  end
end