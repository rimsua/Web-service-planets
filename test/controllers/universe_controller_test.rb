require "test_helper"

class UniverseControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = create_test_user

    @system = @user.star_systems.create!(
      name: "Solar",
      star_type: "G"
    )

    sign_in_as(@user)
  end

  test "shows published systems from different users only" do
    public_system = @user.star_systems.create!(
      name: "Public",
      star_type: "K",
      published: true
    )

    private_system = @user.star_systems.create!(
      name: "Private",
      star_type: "M"
    )

    other_user = User.create!(
      nickname: "second",
      email_address: "second@example.com",
      password: "secret123"
    )

    other_public_system = other_user.star_systems.create!(
      name: "Shared",
      star_type: "A",
      published: true
    )

    get universe_path

    assert_response :success

    root = Nokogiri::HTML(response.body).at_css("#react-root")
    assert_not_nil root

    systems = JSON.parse(root["data-star-systems"])
    system_ids = systems.map { |system| system["id"] }

    assert_includes system_ids, public_system.id
    assert_includes system_ids, other_public_system.id

    assert_not_includes system_ids, private_system.id
    assert_not_includes system_ids, @system.id
  end

  test "requires authentication" do
    sign_out

    get universe_path

    assert_redirected_to new_session_path
  end

  test "another signed-in user can view a published star system" do
    owner = create_test_user

    system = owner.star_systems.create!(
      name: "Public System",
      star_type: "G",
      published: true
    )

    get universe_star_system_path(system)

    assert_response :success
    assert_select "#react-root[data-page='public-star-system']"
    assert_includes response.body, "Public System"
  end

  test "private star system cannot be viewed in public universe" do
    owner = create_test_user

    system = owner.star_systems.create!(
      name: "Private System",
      star_type: "G",
      published: false
    )

    get universe_star_system_path(system)

    assert_response :not_found
  end

  test "signed-in user can open the 3D universe page" do
    get universe_path

    assert_response :success

    assert_select "#react-root[data-page='universe-3d']"
  end

  test "3D preview contains published systems but not private systems" do
    viewer = create_test_user
    owner = create_test_user

    sign_in_as(viewer)

    owner.star_systems.create!(
      name: "Public Galaxy",
      star_type: "G",
      published: true
    )

    owner.star_systems.create!(
      name: "Private Galaxy",
      star_type: "K",
      published: false
    )

    get universe_path

    assert_response :success

    assert_includes response.body, "Public Galaxy"
    refute_includes response.body, "Private Galaxy"
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
