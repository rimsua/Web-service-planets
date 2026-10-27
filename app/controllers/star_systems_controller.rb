class StarSystemsController < ApplicationController
  def index
  @star_systems = Current.user.star_systems
                         .includes(:planets)
                         .order(created_at: :desc)
  end
  
  def show
    @star_system = Current.user.star_systems
                            .includes(:planets)
                            .find(params[:id])
  end

  def update
    @star_system = Current.user.star_systems.find(params[:id])

    if @star_system.update(
      params.require(:star_system).permit(:name)
    )
      respond_to do |format|
        format.html do
          redirect_to star_system_path(@star_system),
                      notice: "Название звёздной системы изменено."
        end

        format.json do
          render json: @star_system.as_json(
            only: [:id, :name, :star_type]
          ), status: :ok
        end
      end
    else
      errors = @star_system.errors.full_messages

      respond_to do |format|
        format.html do
          redirect_to star_system_path(@star_system),
                      alert: errors.to_sentence
        end

        format.json do
          render json: { errors: errors },
                status: :unprocessable_entity
        end
      end
    end
  end

  def destroy
    @star_system = Current.user.star_systems.find(params[:id])
    system_id = @star_system.id

    @star_system.destroy

    respond_to do |format|
      format.html do
        redirect_to star_systems_path,
                    notice: "Звёздная система удалена вместе со всеми её планетами."
      end

      format.json do
        render json: { id: system_id }, status: :ok
      end
    end
  end

  def create
    unless Current.user.can_create_star_system?
      message = "Нельзя создать больше 10 звёздных систем."

      respond_to do |format|
        format.html do
          redirect_to star_systems_path, alert: message
        end

        format.json do
          render json: { errors: [message] },
                status: :unprocessable_entity
        end
      end

      return
    end

    @star_system = Current.user.star_systems.new(star_system_params)

    if @star_system.save
      respond_to do |format|
        format.html do
          redirect_to star_systems_path,
                      notice: "Звёздная система успешно создана."
        end

        format.json do
          render json: @star_system.as_json(
            only: [:id, :name, :star_type]
          ).merge(planet_count: 0),
          status: :created
        end
      end
    else
      respond_to do |format|
        format.html do
          redirect_to star_systems_path,
                      alert: @star_system.errors.full_messages.join(". ")
        end

        format.json do
          render json: { errors: @star_system.errors.full_messages },
                status: :unprocessable_entity
        end
      end
    end
  end

  private

  def star_system_params
    params.require(:star_system).permit(:name, :star_type)
  end
end