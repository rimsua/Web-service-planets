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

  test "different users can have systems with the same name" do
    token = SecureRandom.hex(6)

    another_user = User.new(
      nickname: "u#{token[0, 8]}",
      email_address: "another#{token}@example.com",
      password: "password"
    )

    unless another_user.save
      flunk(
        "Не удалось создать второго пользователя. " \
        "Ошибки: #{another_user.errors.details.inspect}; " \
        "#{another_user.errors.full_messages.inspect}"
      )
    end

    another_system = another_user.star_systems.new(
      name: "Solar",
      star_type: "K"
    )

    assert another_system.valid?,
          another_system.errors.full_messages.to_sentence
  end
  test "a user cannot have systems with duplicate names ignoring case" do
    duplicate = @user.star_systems.new(
      name: "solar",
      star_type: "M"
    )

    assert_not duplicate.valid?
    assert_includes duplicate.errors.attribute_names, :name
  end

  test "spaces around a system name are removed" do
    system = @user.star_systems.new(
      name: "  Alpha Centauri  ",
      star_type: "K"
    )

    assert system.valid?
    assert_equal "Alpha Centauri", system.name
  end

  test "rejects a system name longer than 20 characters" do
    system = @user.star_systems.new(
      name: "A" * 21,
      star_type: "G"
    )

    assert_not system.valid?
    assert_includes system.errors.attribute_names, :name
  end

  test "accepts every supported star type" do
    StarSystem::STAR_TYPES.each do |star_type|
      system = @user.star_systems.new(
        name: "Star #{star_type}",
        star_type: star_type
      )

      assert system.valid?, "Star type #{star_type} should be valid"
    end
  end

  test "destroying a system also destroys its planets" do
    planet = @system.planets.create!(
      name: "Earth",
      planet_type: "rocky",
      temperature: 288,
      atmosphere: "dense",
      water: true
    )

    planet_id = planet.id

    @system.destroy

    assert_not Planet.exists?(planet_id)
  end
end