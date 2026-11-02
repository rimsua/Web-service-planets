class UniverseBroadcaster
  STREAM_NAME = "public_universe"

  # Отправление информации об опубликованной системе
  def self.upsert(star_system)
    return unless star_system&.published?

    ActionCable.server.broadcast(
      STREAM_NAME,
      {
        type: "upsert",
        system: {
          id: star_system.id,
          name: star_system.name,
          star_type: star_system.star_type,
          planet_count: star_system.planets.count,
          owner_nickname: star_system.user.nickname
        }
      }
    )
  end

  # Сообщение, что система больше не публичная
  def self.remove(star_system_id)
    ActionCable.server.broadcast(
      STREAM_NAME,
      {
        type: "remove",
        id: star_system_id
      }
    )
  end
end