require "test_helper"

class StarSystemsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = create_test_user
    @system = @user.star_systems.create!(
      name: "Solar",
      star_type: "G"
    )

    sign_in_as(@user)
  end

  test "creates a star system" do
    assert_difference("StarSystem.count", 1) do
      post star_systems_path,
           params: {
             star_system: {
               name: "Alpha",
               star_type: "K"
             }
           }
    end

    assert_redirected_to root_path
    assert StarSystem.exists?(name: "Alpha", user_id: @user.id)
  end

  test "does not create a system with a duplicate name" do
    assert_no_difference("StarSystem.count") do
      post star_systems_path,
           params: {
             star_system: {
               name: "solar",
               star_type: "K"
             }
           }
    end

    assert_redirected_to root_path
    assert_not_nil flash[:alert]
  end

  test "does not allow more than the system limit" do
    index = 1

    while @user.star_systems.count < User::MAX_STAR_SYSTEMS
      @user.star_systems.create!(
        name: "System #{index}",
        star_type: "G"
      )
      index += 1
    end

    assert_no_difference("StarSystem.count") do
      post star_systems_path,
           params: {
             star_system: {
               name: "Extra System",
               star_type: "G"
             }
           }
    end

    assert_redirected_to root_path
    assert_not_nil flash[:alert]
  end

  test "renames a star system" do
    patch star_system_path(@system),
          params: {
            star_system: { name: "New Solar" }
          }

    assert_redirected_to star_system_path(@system)
    assert_equal "New Solar", @system.reload.name
  end

  test "does not rename a system to a duplicate name" do
    @user.star_systems.create!(
      name: "Alpha",
      star_type: "K"
    )

    patch star_system_path(@system),
          params: {
            star_system: { name: "Alpha" }
          }

    assert_redirected_to star_system_path(@system)
    assert_equal "Solar", @system.reload.name
    assert_not_nil flash[:alert]
  end

  test "deletes a system and its planets" do
    planet = @system.planets.create!(
      name: "Earth",
      planet_type: "rocky",
      temperature: 288,
      atmosphere: "dense",
      water: true
    )

    system_id = @system.id
    planet_id = planet.id

    assert_difference("StarSystem.count", -1) do
      assert_difference("Planet.count", -1) do
        delete star_system_path(@system)
      end
    end

    assert_redirected_to root_path
    assert_not StarSystem.exists?(system_id)
    assert_not Planet.exists?(planet_id)
  end

  test "does not allow access to another user's system" do
    another_user = create_test_user
    another_system = another_user.star_systems.create!(
      name: "Other System",
      star_type: "M"
    )

    get star_system_path(another_system)

    assert_response :missing
  end

  test "requires authentication to create a system" do
    sign_out

    assert_no_difference("StarSystem.count") do
      post star_systems_path,
           params: {
             star_system: {
               name: "Unauthorised",
               star_type: "G"
             }
           }
    end

    assert_redirected_to new_session_path
  end

  private

  def create_test_user
    token = SecureRandom.hex(4)

    User.create!(
      nickname: "u#{token}",
      email_address: "user_#{token}@example.com",
      password: "password"
    )
  end
end