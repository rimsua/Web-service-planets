class PlanetsController < ApplicationController
  def create
    @star_system = Current.user.star_systems.find(
      params[:star_system_id]
    )

    @planet = @star_system.planets.new(planet_params)

    if @planet.save
      redirect_to star_system_path(@star_system),
                  notice: "Планета успешно создана."
    else
      redirect_to star_system_path(@star_system),
                  alert: @planet.errors.full_messages.join(". ")
    end
  end

  private

  def planet_params
    params.require(:planet).permit(
      :name,
      :planet_type,
      :temperature,
      :atmosphere,
      :water
    )
  end
end