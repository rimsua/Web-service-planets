class UniverseController < ApplicationController
  def index
    @star_systems = StarSystem.published
                               .includes(:user, :planets)
                               .order(created_at: :desc)
  end

  def show
    @star_system = StarSystem.published
                              .includes(:user, :planets)
                              .find(params[:id])
  end

  def preview
    @star_systems = StarSystem.published
                              .includes(:user, :planets)
                              .order(created_at: :desc)
  end
end