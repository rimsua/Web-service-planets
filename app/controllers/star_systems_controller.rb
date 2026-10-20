class StarSystemsController < ApplicationController
  def show
    @star_system = Current.user.star_systems
                            .includes(:planets)
                            .find(params[:id])
  end

  def destroy
    @star_system = Current.user.star_systems.find(params[:id])
    @star_system.destroy

    redirect_to root_path,
                notice: "Звёздная система удалена вместе со всеми её планетами."
  end
  
  def create
    unless Current.user.can_create_star_system?
      redirect_to root_path,
                  alert: "Нельзя создать больше 10 звёздных систем."
      return
    end

    @star_system = Current.user.star_systems.new(star_system_params)

    if @star_system.save
      redirect_to root_path,
                  notice: "Звёздная система успешно создана."
    else
      redirect_to root_path,
                  alert: @star_system.errors.full_messages.join(". ")
    end
  end

  private

  def star_system_params
    params.require(:star_system).permit(:name, :star_type)
  end
end