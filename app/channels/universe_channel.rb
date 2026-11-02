class UniverseChannel < ActionCable::Channel::Base
  def subscribed
    reject unless current_user

    stream_from "public_universe"
  end
end