require "test_helper"

class PlanetsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = create_test_user
    @system = @user.star_systems.create!(
      name: "Solar",
      star_type: "G"
    )

    sign_in_as(@user)
  end

  test "creates a planet manually" do
    assert_difference("Planet.count", 1) do
      post star_system_planets_path(@system),
           params: {
             planet: {
               name: "Earth",
               planet_type: "rocky",
               temperature: 288,
               atmosphere: "dense",
               water: true
             }
           }
    end

    assert_redirected_to star_system_path(@system)

    planet = @system.planets.find_by!(name: "Earth")
    assert_equal "rocky", planet.planet_type
    assert_equal 288, planet.temperature
    assert_equal "dense", planet.atmosphere
    assert_equal true, planet.water
  end

  test "creates a planet through JSON" do
      post star_system_planets_path(@system),
          params: {
            planet: {
              name: "Venus",
              planet_type: "rocky",
              temperature: 300,
              atmosphere: "thin",
              water: true
            }
          },
          as: :json

      assert_response :created

      data = JSON.parse(response.body)

      assert_equal "Venus", data["name"]
      assert_equal "rocky", data["planet_type"]
      assert_equal 300, data["temperature"]
      assert_equal "thin", data["atmosphere"]
      assert_equal true, data["water"]
    end

  test "does not create a planet with a duplicate name" do
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
           }
    end

    assert_redirected_to star_system_path(@system)
    assert_not_nil flash[:alert]
  end

  test "generates a random planet" do
    assert_difference("Planet.count", 1) do
      post generate_random_star_system_planets_path(@system)
    end

    assert_redirected_to star_system_path(@system)

    planet = @system.planets.order(:id).last

    assert_match(/\APlanet-\d{6}\z/, planet.name)
    assert_includes Planet::PLANET_TYPES, planet.planet_type
    assert_includes 50..1000, planet.temperature
    assert_includes Planet::ATMOSPHERES, planet.atmosphere
    assert_includes [ true, false ], planet.water
  end

  test "generates a random planet with a custom name" do
    assert_difference("Planet.count", 1) do
      post generate_random_star_system_planets_path(@system),
           params: {
             planet: { name: "My Random Planet" }
           }
    end

    assert_redirected_to star_system_path(@system)
    assert @system.planets.exists?(name: "My Random Planet")
  end

  test "renames a planet" do
    planet = create_test_planet("Earth")

    patch star_system_planet_path(@system, planet),
          params: {
            planet: { name: "New Earth" }
          }

    assert_redirected_to star_system_path(@system)
    assert_equal "New Earth", planet.reload.name
  end

  test "updates planet properties through JSON" do
    planet = create_test_planet("Mars")

    patch star_system_planet_path(@system, planet),
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

    data = JSON.parse(response.body)

    assert_equal "Ocean", data["name"]
    assert_equal "ocean", data["planet_type"]
    assert_equal 300, data["temperature"]
    assert_equal "thin", data["atmosphere"]
    assert_equal true, data["water"]
    assert_equal true, data["habitable"]
  end

  test "updates all planet properties" do
    planet = create_test_planet("Mars")

    patch star_system_planet_path(@system, planet),
          params: {
            planet: {
              name: "OceanicPlanet",
              planet_type: "ocean",
              temperature: 300,
              atmosphere: "thin",
              water: "true"
            }
          }

    assert_redirected_to star_system_path(@system)

    planet.reload

    assert_equal "OceanicPlanet", planet.name
    assert_equal "ocean", planet.planet_type
    assert_equal 300, planet.temperature
    assert_equal "thin", planet.atmosphere
    assert_equal true, planet.water
  end

  test "accepts a planet name with 25 characters" do
    name = "PlanetName123456789012345"

    assert_equal 25, name.length

    assert_difference("Planet.count", 1) do
      post star_system_planets_path(@system),
          params: {
            planet: {
              name: name,
              planet_type: "rocky",
              temperature: 288,
              atmosphere: "dense",
              water: true
            }
          }
    end

    assert_redirected_to star_system_path(@system)
    assert @system.planets.exists?(name: name)
  end

  test "rejects a planet name longer than 25 characters" do
    name = "PlanetName1234567890123456"

    assert_equal 26, name.length

    assert_no_difference("Planet.count") do
      post star_system_planets_path(@system),
          params: {
            planet: {
              name: name,
              planet_type: "rocky",
              temperature: 288,
              atmosphere: "dense",
              water: true
            }
          }
    end

    assert_redirected_to star_system_path(@system)
    assert_not_nil flash[:alert]
  end

  test "does not rename a planet to a duplicate name" do
    create_test_planet("Earth")
    mars = create_test_planet("Mars")

    patch star_system_planet_path(@system, mars),
          params: {
            planet: { name: "earth" }
          }

    assert_redirected_to star_system_path(@system)
    assert_equal "Mars", mars.reload.name
    assert_not_nil flash[:alert]
  end

  test "deletes a planet" do
    planet = create_test_planet("Earth")
    planet_id = planet.id

    assert_difference("Planet.count", -1) do
      delete star_system_planet_path(@system, planet)
    end

    assert_redirected_to star_system_path(@system)
    assert_not Planet.exists?(planet_id)
  end

  test "does not allow access to another user's system" do
    another_user = create_test_user
    another_system = another_user.star_systems.create!(
      name: "Other System",
      star_type: "M"
    )

    post star_system_planets_path(another_system),
     params: {
       planet: {
         name: "Unauthorized Planet",
         planet_type: "rocky",
         temperature: 288,
         atmosphere: "dense",
         water: true
       }
     }

    assert_response :missing
  end

  test "cannot rename another user's planet through this system" do
    another_user = create_test_user
    another_system = another_user.star_systems.create!(
      name: "Other System",
      star_type: "K"
    )

    another_planet = another_system.planets.create!(
      name: "Other Earth",
      planet_type: "rocky",
      temperature: 288,
      atmosphere: "dense",
      water: true
    )

    patch star_system_planet_path(@system, another_planet),
      params: {
        planet: { name: "Changed Name" }
      }

    assert_response :missing
    assert_equal "Other Earth", another_planet.reload.name
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

  def create_test_planet(name)
    @system.planets.create!(
      name: name,
      planet_type: "rocky",
      temperature: 288,
      atmosphere: "dense",
      water: true
    )
  end
end
