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

  def generate_random
    @star_system = Current.user.star_systems.find(
      params[:star_system_id]
    )

    custom_name = params.dig(:planet, :name).to_s.strip

    @planet = @star_system.planets.new(
      name: custom_name.presence || "Planet-#{rand(100000..999999)}",
      planet_type: Planet::PLANET_TYPES.sample,
      temperature: rand(50..1000),
      atmosphere: Planet::ATMOSPHERES.sample,
      water: [true, false].sample
    )

    if @planet.save
      redirect_to star_system_path(@star_system),
                  notice: "Случайная планета успешно создана."
    else
      redirect_to star_system_path(@star_system),
                  alert: @planet.errors.full_messages.join(". ")
    end
  end

  def update
    @star_system = Current.user.star_systems.find(params[:star_system_id])
    @planet = @star_system.planets.find(params[:id])

    if @planet.update(params.require(:planet).permit(:name))
      redirect_to star_system_path(@star_system),
                  notice: "Название планеты изменено."
    else
      redirect_to star_system_path(@star_system),
                  alert: @planet.errors.full_messages.to_sentence
    end
  end

  def destroy
    @star_system = Current.user.star_systems.find(
      params[:star_system_id]
    )

    @planet = @star_system.planets.find(params[:id])
    @planet.destroy

    redirect_to star_system_path(@star_system),
                notice: "Планета удалена"
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