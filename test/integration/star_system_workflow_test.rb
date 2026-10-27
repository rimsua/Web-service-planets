require "test_helper"

class StarSystemWorkflowTest < ActionDispatch::IntegrationTest
  setup do
    @user = create_test_user

    @system = @user.star_systems.create!(
      name: "Solar",
      star_type: "G"
    )

    sign_in_as(@user)
  end

  # сценарий:
  # создание системы -> создание планеты -> изменение данных ->
  # проверка страницы -> удаление планеты -> удаление системы
  test "user can complete the star system and planet workflow" do
    # 1. Создаём звёздную систему.
    assert_difference("StarSystem.count", 1) do
      post star_systems_path,
           params: {
             star_system: {
               name: "Kepler-22",
               star_type: "K"
             }
           },
           as: :json
    end

    assert_response :created

    system_data = JSON.parse(response.body)

    assert_equal "Kepler-22", system_data["name"]
    assert_equal "K", system_data["star_type"]
    assert_equal 0, system_data["planet_count"]

    system = @user.star_systems.find(system_data.fetch("id"))

    # 2. Создание планеты в созданной системе
    assert_difference("Planet.count", 1) do
      post star_system_planets_path(system),
           params: {
             planet: {
               name: "Earth",
               planet_type: "rocky",
               temperature: 288,
               atmosphere: "dense",
               water: true
             }
           },
           as: :json
    end

    assert_response :created

    planet_data = JSON.parse(response.body)

    assert_equal "Earth", planet_data["name"]
    assert_equal "rocky", planet_data["planet_type"]
    assert_equal 288, planet_data["temperature"]
    assert_equal "dense", planet_data["atmosphere"]
    assert_equal true, planet_data["water"]

    planet = system.planets.find(planet_data.fetch("id"))

    # 3. Переименование звезджной системы
    patch star_system_path(system),
          params: {
            star_system: {
              name: "New Kepler"
            }
          },
          as: :json

    assert_response :success
    assert_equal "New Kepler", JSON.parse(response.body)["name"]
    assert_equal "New Kepler", system.reload.name

    # 4. Изменение параметров палнеты
    patch star_system_planet_path(system, planet),
          params: {
            planet: {
              name: "Ocean",
              planet_type: "ocean",
              temperature: 300,
              atmosphere: "thin",
              water: true
            }
          },
          as: :json

    assert_response :success

    updated_planet_data = JSON.parse(response.body)

    assert_equal "Ocean", updated_planet_data["name"]
    assert_equal "ocean", updated_planet_data["planet_type"]
    assert_equal 300, updated_planet_data["temperature"]
    assert_equal "thin", updated_planet_data["atmosphere"]
    assert_equal true, updated_planet_data["water"]

    planet.reload

    assert_equal "Ocean", planet.name
    assert_equal "ocean", planet.planet_type
    assert_equal 300, planet.temperature
    assert_equal "thin", planet.atmosphere
    assert_equal true, planet.water

    # 5. Открываем страницу системы и проверяем ответ приложения
    get star_system_path(system)

    assert_response :success
    assert_select "#react-root[data-page='star-system']"
    assert_select "#react-root[data-star-system]"
    assert_includes response.body, "New Kepler"
    assert_includes response.body, "Ocean"

    # 6. Удаление планеты
    planet_id = planet.id

    assert_difference("Planet.count", -1) do
      delete star_system_planet_path(system, planet),
             as: :json
    end

    assert_response :success
    assert_not Planet.exists?(planet_id)

    # 7. Создание еще одной планеты (чтобы проверить удаление
    # системы вместе с оставшимися планетами )
    assert_difference("Planet.count", 1) do
      post star_system_planets_path(system),
           params: {
             planet: {
               name: "Mars",
               planet_type: "rocky",
               temperature: 210,
               atmosphere: "thin",
               water: false
             }
           },
           as: :json
    end

    assert_response :created

    second_planet = system.planets.find_by!(name: "Mars")
    system_id = system.id
    second_planet_id = second_planet.id

    # 8. Удаление системы и проверка удаления ее планеты
    assert_difference("StarSystem.count", -1) do
      assert_difference("Planet.count", -1) do
        delete star_system_path(system), as: :json
      end
    end

    assert_response :success
    assert_equal system_id, JSON.parse(response.body)["id"]

    assert_not StarSystem.exists?(system_id)
    assert_not Planet.exists?(second_planet_id)
  end

  # 1: пользователь пытается изменить чужие данные:
  test "user cannot modify another user's system or planet" do
    another_user = create_test_user

    another_system = another_user.star_systems.create!(
      name: "Other System",
      star_type: "M"
    )

    another_planet = another_system.planets.create!(
      name: "Other Earth",
      planet_type: "rocky",
      temperature: 288,
      atmosphere: "dense",
      water: true
    )

    # Попытка переименовать чужую систему:
    patch star_system_path(another_system),
          params: {
            star_system: {
              name: "Hacked System"
            }
          },
          as: :json

    assert_response :missing
    assert_equal "Other System", another_system.reload.name

    # Попытка изменить планету другого пользователя
    # через собственную звёздную систему
    patch star_system_planet_path(@system, another_planet),
          params: {
            planet: {
              name: "Hacked Planet"
            }
          },
          as: :json

    assert_response :missing
    assert_equal "Other Earth", another_planet.reload.name

    # Попытка удалить чужую систему.
    delete star_system_path(another_system), as: :json

    assert_response :missing
    assert StarSystem.exists?(another_system.id)
    assert Planet.exists?(another_planet.id)
  end

  # 2: пользователь без авторизации пытается
  # создать систему и планету
  test "unauthenticated user cannot create systems or planets" do
    sign_out

    assert_no_difference("StarSystem.count") do
      post star_systems_path,
           params: {
             star_system: {
               name: "Unauthorised System",
               star_type: "G"
             }
           }
    end

    assert_redirected_to new_session_path

    assert_no_difference("Planet.count") do
      post star_system_planets_path(@system),
           params: {
             planet: {
               name: "Unauthorised Planet",
               planet_type: "rocky",
               temperature: 288,
               atmosphere: "dense",
               water: true
             }
           }
    end

    assert_redirected_to new_session_path
  end

  # 3: приложение отклоняет повторяющиеся названия
  # и не создаёт некорректные записи
  test "duplicate system and planet names are rejected" do
    # Название системы не должно дублировать Solar,
    # даже если отличается регистр букв
    assert_no_difference("StarSystem.count") do
      post star_systems_path,
           params: {
             star_system: {
               name: "solar",
               star_type: "K"
             }
           },
           as: :json
    end

    assert_response :unprocessable_entity

    # Создание планеты, название которой дублируем дальше
    @system.planets.create!(
      name: "Earth",
      planet_type: "rocky",
      temperature: 288,
      atmosphere: "dense",
      water: true
    )

    assert_no_difference("Planet.count") do
      post star_system_planets_path(@system),
           params: {
             planet: {
               name: "earth",
               planet_type: "rocky",
               temperature: 288,
               atmosphere: "dense",
               water: true
             }
           },
           as: :json
    end

    assert_response :unprocessable_entity
  end

  private

  def create_test_user
    token = SecureRandom.hex(4)

    User.create!(
      nickname: "u#{token}",
      email_address: "user_#{token}@example.com",
      password: "password"
    )
  end
end
