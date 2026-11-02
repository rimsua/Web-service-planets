import { useRef, useState } from "react"

import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Stars } from "@react-three/drei"


const STAR_COLORS = {
  O: "#83adff",
  B: "#b8d2ff",
  A: "#f0f1ff",
  F: "#fff0c5",
  G: "#ffd46f",
  K: "#ffa45e",
  M: "#ff7164"
}


const PLANET_APPEARANCE = {
  rocky: { color: "#b8795e", size: 0.22 },
  gas: { color: "#c5a0e8", size: 0.34 },
  ice: { color: "#a9dff5", size: 0.23 },
  ocean: { color: "#438fd0", size: 0.26 },
  lava: { color: "#ed7652", size: 0.21 }
}


// Центральная звезда.
function SystemStar({ starType }) {
  const starRef = useRef(null)

  const color = STAR_COLORS[starType] || STAR_COLORS.G

  useFrame((_, delta) => {
    if (starRef.current) {
      starRef.current.rotation.y += delta * 0.2
    }
  })

  return (
    <>
      <mesh ref={starRef}>
        <sphereGeometry args={[0.65, 48, 48]} />

        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.6}
          roughness={0.65}
        />
      </mesh>

      <mesh scale={1.35} raycast={() => null}>
        <sphereGeometry args={[0.65, 32, 32]} />

        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.08}
          depthWrite={false}
        />
      </mesh>

      <pointLight
        color={color}
        intensity={55}
        distance={20}
        decay={2}
      />
    </>
  )
}


// Планета и её орбита.
function OrbitingPlanet({
  planet,
  index,
  selected,
  onSelect
}) {
  const orbitRef = useRef(null)
  const planetRef = useRef(null)

  const [hovered, setHovered] = useState(false)

  const appearance =
    PLANET_APPEARANCE[planet.planet_type] ||
    PLANET_APPEARANCE.rocky

  const distance = 1.8 + index * 0.85
  const speed = 0.38 / (1 + index * 0.35)

  useFrame((_, delta) => {
    if (orbitRef.current) {
      orbitRef.current.rotation.y += delta * speed
    }

    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.3
    }
  })

  const handleSelect = (event) => {
    event.stopPropagation()
    onSelect(planet)
  }

  return (
    <group ref={orbitRef}>
      {/* Орбита планеты */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry
          args={[distance, 0.007, 8, 128]}
        />

        <meshBasicMaterial
          color="#9aa9ca"
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Положение планеты на орбите */}
      <group position={[distance, 0, 0]}>
        <mesh
          ref={planetRef}
          scale={selected ? 1.22 : 1}
          onClick={handleSelect}
          onPointerOver={(event) => {
            event.stopPropagation()
            setHovered(true)
          }}
          onPointerOut={() => setHovered(false)}
        >
          <sphereGeometry
            args={[appearance.size, 40, 40]}
          />

          <meshStandardMaterial
            color={appearance.color}
            emissive={appearance.color}
            emissiveIntensity={
              selected ? 0.55 : hovered ? 0.3 : 0.08
            }
            roughness={0.82}
            metalness={0.04}
          />
        </mesh>

        {/* У газовых планет есть декоративное кольцо */}
        {planet.planet_type === "gas" && (
          <mesh
            rotation={[Math.PI / 2.6, 0.15, 0]}
            raycast={() => null}
          >
            <torusGeometry
              args={[
                appearance.size * 1.55,
                appearance.size * 0.12,
                8,
                64
              ]}
            />

            <meshStandardMaterial
              color="#ddc5f0"
              transparent
              opacity={0.65}
            />
          </mesh>
        )}

        {/* Лёгкий ореол у планет с атмосферой */}
        {planet.atmosphere !== "none" && (
          <mesh
            scale={1.28}
            raycast={() => null}
          >
            <sphereGeometry
              args={[appearance.size, 24, 24]}
            />

            <meshBasicMaterial
              color={
                planet.water
                  ? "#65cfff"
                  : appearance.color
              }
              transparent
              opacity={0.12}
              depthWrite={false}
            />
          </mesh>
        )}
      </group>
    </group>
  )
}


// Содержимое 3D-сцены.
function SceneContents({
  starType,
  planets,
  selectedPlanetId,
  onSelectPlanet
}) {
  return (
    <>
      <ambientLight intensity={0.55} />

      <SystemStar starType={starType} />

      <Stars
        radius={70}
        depth={45}
        count={1000}
        factor={2.5}
        saturation={0.2}
        fade
        speed={0.2}
      />

      {planets.map((planet, index) => (
        <OrbitingPlanet
          key={planet.id}
          planet={planet}
          index={index}
          selected={planet.id === selectedPlanetId}
          onSelect={onSelectPlanet}
        />
      ))}

      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom
        minDistance={5}
        maxDistance={20}
        maxPolarAngle={Math.PI * 0.85}
      />
    </>
  )
}


function SystemScene3D({
  starType = "G",
  planets = []
}) {
  const [selectedPlanet, setSelectedPlanet] = useState(null)

  const planetTypeLabels = {
    rocky: "Каменистая",
    gas: "Газовая",
    ice: "Ледяная",
    ocean: "Океаническая",
    lava: "Лавовая"
  }

  const atmosphereLabels = {
    none: "Нет",
    thin: "Разреженная",
    dense: "Плотная"
  }

  return (
    <div className="system-3d-view">
      <div className="system-3d-canvas">
        <Canvas
          camera={{
            position: [0, 6, 10],
            fov: 45
          }}
          dpr={[1, 2]}
          gl={{ antialias: true }}
        >
          <color
            attach="background"
            args={["#080b17"]}
          />

          <SceneContents
            starType={starType}
            planets={planets}
            selectedPlanetId={selectedPlanet?.id}
            onSelectPlanet={setSelectedPlanet}
          />
        </Canvas>
      </div>

      <p className="system-3d-instruction">
        Нажми на планету в сцене или выбери её в списке ниже.
        Перетаскивай мышь, чтобы вращать камеру.
      </p>

      <div className="system-3d-planet-select">
        {planets.map((planet) => (
          <button
            type="button"
            key={planet.id}
            className={`system-3d-planet-button ${
              selectedPlanet?.id === planet.id
                ? "system-3d-planet-button--active"
                : ""
            }`}
            onClick={() => setSelectedPlanet(planet)}
          >
            {planet.name}
          </button>
        ))}
      </div>

      {selectedPlanet && (
        <div
          className="system-3d-planet-info"
          aria-live="polite"
        >
          <div className="system-3d-planet-info__header">
            <div>
              <p className="eyebrow">SELECTED PLANET</p>

              <h3>{selectedPlanet.name}</h3>
            </div>

            <button
              type="button"
              className="btn btn--secondary btn--small"
              onClick={() => setSelectedPlanet(null)}
            >
              Сбросить выбор
            </button>
          </div>

          <dl className="planet-properties">
            <div>
              <dt>Тип</dt>
              <dd>
                {planetTypeLabels[selectedPlanet.planet_type] ||
                  selectedPlanet.planet_type}
              </dd>
            </div>

            <div>
              <dt>Температура</dt>
              <dd>{selectedPlanet.temperature} K</dd>
            </div>

            <div>
              <dt>Атмосфера</dt>
              <dd>
                {atmosphereLabels[selectedPlanet.atmosphere] ||
                  selectedPlanet.atmosphere}
              </dd>
            </div>

            <div>
              <dt>Вода</dt>
              <dd>{selectedPlanet.water ? "Есть" : "Нет"}</dd>
            </div>

            <div>
              <dt>Пригодность по модели</dt>
              <dd>
                {selectedPlanet.habitable
                  ? "Потенциально пригодна"
                  : "Не проходит критерии"}
              </dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  )
}

export default SystemScene3D