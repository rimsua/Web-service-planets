require "test_helper"

class SignUpsControllerTest < ActionDispatch::IntegrationTest
  test "user can view sign up page" do
    get sign_up_path

    assert_response :success
  end

  test "successful sign up creates user" do
    assert_difference "User.count", 1 do
      post sign_up_path, params: {
        user: {
          nickname: "space_user",
          email_address: "space@example.com",
          password: "password",
          password_confirmation: "password"
        }
      }
    end

    assert_redirected_to root_path
  end

  test "invalid sign up does not create user" do
    assert_no_difference "User.count" do
      post sign_up_path, params: {
        user: {
          nickname: "",
          email_address: "space@example.com",
          password: "password",
          password_confirmation: "wrong"
        }
      }
    end

    assert_response :unprocessable_entity
  end
end