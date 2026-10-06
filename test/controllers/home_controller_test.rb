require "test_helper"

class HomeControllerTest < ActionDispatch::IntegrationTest
  test "authenticated user can view home page" do
    sign_in_as(User.take)

    get root_path

    assert_response :success
    assert_select "#react-root[data-page='home']"
  end

  test "unauthenticated user is redirected to login" do
    get root_path

    assert_redirected_to new_session_path
  end
end