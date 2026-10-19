require "test_helper"

class StarSystemTest < ActiveSupport::TestCase
  setup do
    @user = User.create!(
      nickname: "systemuser",
      email_address: "system@example.com",
      password: "password"
    )

    @system = @user.star_systems.create!(name: "Solar")
  end

  test "star type defaults to G" do
    assert_equal "G", @system.star_type
  end

  test "accepts a valid star type" do
    @system.star_type = "M"

    assert @system.valid?
  end

  test "rejects an unknown star type" do
    @system.star_type = "purple"

    assert_not @system.valid?
    assert_includes @system.errors.attribute_names, :star_type
  end

  test "has a user" do
    assert_equal @user, @system.user
  end

  test "starts with zero planets" do
    assert_equal 0, @system.planet_count
  end

  test "planet_count returns number of planets" do
    @system.planets.create!(
      name: "Earth",
      planet_type: "rocky",
      temperature: 288,
      atmosphere: "dense",
      water: true
    )

    @system.planets.create!(
      name: "Mars",
      planet_type: "rocky",
      temperature: 210,
      atmosphere: "thin",
      water: false
    )

    assert_equal 2, @system.planet_count
  end
end