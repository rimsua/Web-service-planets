require "test_helper"

class UserTest < ActiveSupport::TestCase
  setup do
    @user = User.create!(
      nickname: "testuser",
      email_address: "test@example.com",
      password: "password"
    )
  end

  test "can create star system when user has less than 10 systems" do
    assert @user.can_create_star_system?
  end

  test "cannot create star system when user has 10 systems" do
    10.times do |i|
      @user.star_systems.create!(name: "System #{i}")
    end

    assert_not @user.can_create_star_system?
  end

  test "user has many star systems" do
    @user.star_systems.create!(name: "Solar")

    assert_equal 1, @user.star_systems.count
  end
end