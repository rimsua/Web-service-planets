class PlanetsController < ApplicationController
  def create
    @star_system = Current.user.star_systems.find(
      params[:star_system_id]
    )

    @planet = @star_system.planets.new(planet_params)

    if @planet.save
      respond_to do |format|
        format.html do
          redirect_to star_system_path(@star_system),
                      notice: "Планета успешно создана."
        end

        format.json do
          render json: planet_json(@planet), status: :created
        end
      end
    else
      respond_to do |format|
        format.html do
          redirect_to star_system_path(@star_system),
                      alert: @planet.errors.full_messages.join(". ")
        end

        format.json do
          render json: { errors: @planet.errors.full_messages },
                 status: :unprocessable_entity
        end
      end
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
      respond_to do |format|
        format.html do
          redirect_to star_system_path(@star_system),
                      notice: "Случайная планета успешно создана."
        end

        format.json do
          render json: planet_json(@planet), status: :created
        end
      end
    else
      respond_to do |format|
        format.html do
          redirect_to star_system_path(@star_system),
                      alert: @planet.errors.full_messages.join(". ")
        end

        format.json do
          render json: { errors: @planet.errors.full_messages },
                 status: :unprocessable_entity
        end
      end
    end
  end

  def update
    @star_system = Current.user.star_systems.find(
      params[:star_system_id]
    )
    @planet = @star_system.planets.find(params[:id])

    if @planet.update(planet_params)
      respond_to do |format|
        format.html do
          redirect_to star_system_path(@star_system),
                      notice: "Параметры планеты изменены."
        end

        format.json do
          render json: planet_json(@planet)
        end
      end
    else
      respond_to do |format|
        format.html do
          redirect_to star_system_path(@star_system),
                      alert: @planet.errors.full_messages.to_sentence
        end

        format.json do
          render json: { errors: @planet.errors.full_messages },
                 status: :unprocessable_entity
        end
      end
    end
  end

  def destroy
    @star_system = Current.user.star_systems.find(
      params[:star_system_id]
    )
    @planet = @star_system.planets.find(params[:id])
    planet_id = @planet.id

    @planet.destroy

    respond_to do |format|
      format.html do
        redirect_to star_system_path(@star_system),
                    notice: "Планета удалена."
      end

      format.json do
        render json: { id: planet_id }
      end
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

  def planet_json(planet)
    planet.as_json(
      only: [
        :id,
        :name,
        :planet_type,
        :temperature,
        :atmosphere,
        :water
      ]
    ).merge(habitable: planet.habitable?)
  end
end