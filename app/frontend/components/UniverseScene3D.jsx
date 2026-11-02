import { useRef, useState } from "react"

import { Canvas, useFrame } from "@react-three/fiber"

import {
  Html,
  OrbitControls,
  Stars
} from "@react-three/drei"


// Цвета звёзд в зависимости от спектрального класса.
const STAR_COLORS = {
  O: "#8fbaff",
  B: "#b7d2ff",
  A: "#f0f1ff",
  F: "#fff0c5",
  G: "#ffd46f",
  K: "#ffa05f",
  M: "#ff7164"
}


// Определяем положение звезды на карте.
// Положение зависит от ID системы и остаётся стабильным.
function getStarPosition(system, index, total) {
  if (total === 1) {
    return [0, 0, 0]
  }

  const numericId = Number(system.id)

  const seed =
    Number.isFinite(numericId) && numericId > 0
      ? numericId
      : index + 1

  const angle = seed * 2.399963229728653

  const distance =
    2.5 + (seed * 7 % 9) * 0.65

  const height =
    ((seed * 13 % 7) - 3) * 0.45

  return [
    Math.cos(angle) * distance,
    height,
    Math.sin(angle) * distance
  ]
}


// Одна опубликованная система на карте.
function StarMarker({ system, position }) {
  const starRef = useRef(null)

  const [isHovered, setIsHovered] = useState(false)

  const color =
    STAR_COLORS[system.star_type] || STAR_COLORS.G

  const planetCount = Number(system.planet_count) || 0

  // Размер немного зависит от количества планет.
  const starSize =
    0.15 + Math.min(planetCount, 8) * 0.018

  // Небольшое вращение звезды.
  useFrame((_, delta) => {
    if (starRef.current) {
      starRef.current.rotation.y += delta * 0.35
    }
  })

  const openSystem = (event) => {
    event.stopPropagation()

    window.location.assign(`/universe/${system.id}`)
  }

  return (
    <group position={position}>
      <mesh
        ref={starRef}
        onClick={openSystem}
        onPointerOver={(event) => {
          event.stopPropagation()
          setIsHovered(true)
        }}
        onPointerOut={() => setIsHovered(false)}
      >
        <sphereGeometry
          args={[starSize, 32, 32]}
        />

        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isHovered ? 2 : 1.1}
          roughness={0.6}
        />
      </mesh>

      {/* Свечение вокруг звезды */}
      <mesh
        scale={2.2}
        raycast={() => null}
      >
        <sphereGeometry
          args={[starSize, 24, 24]}
        />

        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.09}
          depthWrite={false}
        />
      </mesh>

      {/* Информация при наведении */}
      {isHovered && (
        <Html
          position={[0, starSize + 0.3, 0]}
          center
          distanceFactor={12}
          style={{ pointerEvents: "none" }}
        >
          <div className="universe-3d-tooltip">
            <strong>{system.name}</strong>

            <span>
              Класс {system.star_type}
            </span>

            <span>
              Планет: {planetCount}
            </span>

            <span>
              Автор: {system.owner_nickname}
            </span>
          </div>
        </Html>
      )}
    </group>
  )
}


// Основная сцена.
function SceneContents({ starSystems }) {
  return (
    <>
      <ambientLight intensity={0.65} />

      <directionalLight
        position={[5, 8, 5]}
        intensity={1.2}
      />

      {/* Звёздный фон */}
      <Stars
        radius={80}
        depth={50}
        count={1200}
        factor={3}
        saturation={0.2}
        fade
        speed={0.25}
      />

      {/* Реальные опубликованные системы */}
      {starSystems.map((system, index) => (
        <StarMarker
          key={system.id}
          system={system}
          position={getStarPosition(
            system,
            index,
            starSystems.length
          )}
        />
      ))}

      {/* Управление камерой */}
      <OrbitControls
        makeDefault
        enablePan
        enableZoom
        minDistance={5}
        maxDistance={35}
        maxPolarAngle={Math.PI * 0.9}
      />
    </>
  )
}


function UniverseScene3D({ starSystems = [] }) {
  return (
    <div className="universe-3d-canvas">
      <Canvas
        camera={{
          position: [0, 10, 18],
          fov: 48
        }}
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        <color
          attach="background"
          args={["#080b17"]}
        />

        <SceneContents
          starSystems={starSystems}
        />
      </Canvas>
    </div>
  )
}

export default UniverseScene3D