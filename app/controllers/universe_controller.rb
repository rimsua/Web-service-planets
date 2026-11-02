class UniverseController < ApplicationController
  def index
    @star_systems = StarSystem.published
      .includes(:user, :planets)
      .order(created_at: :desc)

    respond_to do |format|
      format.html

      format.json do
        render json: @star_systems.map { |system|
          {
            id: system.id,
            name: system.name,
            star_type: system.star_type,
            planet_count: system.planets.size,
            owner_nickname: system.user.nickname
          }
        }
      end
    end
  end

  def show
    @star_system = StarSystem.published
                              .includes(:user, :planets)
                              .find(params[:id])
  end
end