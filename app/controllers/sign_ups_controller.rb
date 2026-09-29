class SignUpsController < ApplicationController
  skip_before_action :require_authentication

  before_action :redirect_if_authenticated

  # GET /sign_up
  def show
    @user = User.new
  end

  # POST /sign_up
  def create
    @user = User.new(sign_up_params)

    if @user.save
      start_new_session_for(@user)

      redirect_to root_path, notice: "Регистрация прошла успешно!"
    else
      render :show, status: :unprocessable_entity
    end
  end

  private

  def redirect_if_authenticated
    redirect_to root_path if authenticated?
  end

  # Разрешаем контроллеру принимать только нужные поля
  def sign_up_params
    params.require(:user).permit(
      :nickname,
      :email_address,
      :password,
      :password_confirmation
    )
  end
end