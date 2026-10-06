require "test_helper"

class UiKitControllerTest < ActionDispatch::IntegrationTest
  test "authenticated user can view UI kit" do
    sign_in_as(User.take)

    get ui_kit_path

    assert_response :success
    assert_select "#react-root[data-page='ui-kit']"
  end

  test "unauthenticated user is redirected to login" do
    get ui_kit_path

    assert_redirected_to new_session_path
  end
end