
import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const COLORS = {
  skin: '#B67A61',
  skinShadow: '#9B5E49',
  hair: '#17121C',
  hairLight: '#29202C',
  hoodie: '#B39AEF',
  hoodieDark: '#9678D7',
  hoodieLight: '#D2BFFA',
  eyes: '#392723',
  lips: '#753D47',
  gold: '#EFCB88',
}

function Smile() {
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.12, -0.24, 0.585),
        new THREE.Vector3(0, -0.29, 0.615),
        new THREE.Vector3(0.12, -0.24, 0.585),
      ]),
    []
  )

  return (
    <mesh>
      <tubeGeometry args={[curve, 24, 0.012, 8, false]} />
      <meshStandardMaterial color={COLORS.lips} />
    </mesh>
  )
}

function Eye({ x }) {
  return (
    <group position={[x, 0.035, 0.54]}>
      <mesh scale={[0.105, 0.13, 0.045]}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshStandardMaterial color="#FFF9F5" />
      </mesh>

      <mesh position={[0, 0, 0.045]}>
        <sphereGeometry args={[0.061, 24, 24]} />
        <meshStandardMaterial color={COLORS.eyes} />
      </mesh>

      <mesh position={[-0.017, 0.023, 0.099]}>
        <sphereGeometry args={[0.017, 16, 16]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
    </group>
  )
}

function Hair() {
  const curls = useMemo(() => {
    const result = []

    for (let i = 0; i < 12; i++) {
      const angle = (i / 11) * Math.PI

      result.push({
        x: Math.cos(angle) * 0.55,
        y: 0.47 + Math.sin(angle) * 0.1,
        z: 0.18 + Math.sin(angle) * 0.3,
        size: 0.17 + (i % 3) * 0.015,
      })
    }

    return result
  }, [])

  return (
    <group>
      {/* Back hair */}
      <mesh
        position={[0, 0.05, -0.12]}
        scale={[0.69, 0.78, 0.46]}
      >
        <sphereGeometry args={[1, 40, 40]} />
        <meshStandardMaterial color={COLORS.hair} roughness={0.93} />
      </mesh>

      {/* Crown */}
      <mesh
        position={[0, 0.46, -0.06]}
        scale={[0.68, 0.35, 0.58]}
      >
        <sphereGeometry args={[1, 40, 40]} />
        <meshStandardMaterial color={COLORS.hair} roughness={0.93} />
      </mesh>

      {/* Front curls */}
      {curls.map((curl, i) => (
        <mesh
          key={i}
          position={[curl.x, curl.y, curl.z]}
        >
          <sphereGeometry args={[curl.size, 16, 16]} />
          <meshStandardMaterial
            color={i % 3 === 0 ? COLORS.hairLight : COLORS.hair}
            roughness={0.95}
          />
        </mesh>
      ))}

      {/* Side locks */}
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh
            position={[side * 0.55, -0.11, -0.03]}
            rotation={[0, 0, side * -0.1]}
            scale={[0.15, 0.5, 0.25]}
          >
            <sphereGeometry args={[1, 24, 24]} />
            <meshStandardMaterial color={COLORS.hair} />
          </mesh>

          <mesh position={[side * 0.56, -0.45, 0.01]}>
            <sphereGeometry args={[0.15, 20, 20]} />
            <meshStandardMaterial color={COLORS.hair} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function Headphones() {
  const bandCurve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.71, -0.06, -0.02),
        new THREE.Vector3(-0.69, 0.4, -0.07),
        new THREE.Vector3(-0.43, 0.79, -0.08),
        new THREE.Vector3(0, 0.91, -0.08),
        new THREE.Vector3(0.43, 0.79, -0.08),
        new THREE.Vector3(0.69, 0.4, -0.07),
        new THREE.Vector3(0.71, -0.06, -0.02),
      ]),
    []
  )

  return (
    <group>
      {/* Curved headphone band */}
      <mesh>
        <tubeGeometry args={[bandCurve, 64, 0.055, 10, false]} />
        <meshStandardMaterial
          color={COLORS.hoodieDark}
          roughness={0.45}
          metalness={0.15}
        />
      </mesh>

      {/* Ear cups */}
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh
            position={[side * 0.71, -0.06, 0.01]}
            scale={[0.12, 0.29, 0.25]}
          >
            <sphereGeometry args={[1, 24, 24]} />
            <meshStandardMaterial color={COLORS.hoodie} />
          </mesh>

          <mesh
            position={[side * 0.79, -0.06, 0.01]}
            scale={[0.045, 0.19, 0.18]}
          >
            <sphereGeometry args={[1, 24, 24]} />
            <meshStandardMaterial
              color={COLORS.hoodieLight}
              metalness={0.2}
              roughness={0.4}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function Arm({ side, armRef }) {
  return (
    <group
      ref={armRef}
      position={[side * 0.65, -0.42, 0]}
    >
      {/* Sleeve */}
      <mesh
        position={[side * 0.07, -0.3, 0]}
        rotation={[0, 0, side * 0.2]}
      >
        <capsuleGeometry args={[0.22, 0.5, 8, 20]} />
        <meshStandardMaterial
          color={COLORS.hoodie}
          roughness={0.82}
        />
      </mesh>

      {/* Cuff */}
      <mesh
        position={[side * 0.12, -0.73, 0.015]}
        rotation={[0, 0, side * 0.2]}
      >
        <cylinderGeometry args={[0.21, 0.21, 0.15, 24]} />
        <meshStandardMaterial
          color={COLORS.hoodieDark}
          roughness={0.8}
        />
      </mesh>

      {/* Hand */}
      <mesh position={[side * 0.14, -0.88, 0.015]}>
        <sphereGeometry args={[0.15, 24, 24]} />
        <meshStandardMaterial color={COLORS.skin} />
      </mesh>
    </group>
  )
}

function AvatarCharacter({ reducedMotion }) {
  const body = useRef()
  const head = useRef()
  const eyes = useRef()
  const rightArm = useRef()

  const blink = useRef({
    elapsed: 0,
    next: 3,
    active: 0,
  })

  const wave = useRef({
    elapsed: 0,
    active: false,
  })

  const handleWave = (event) => {
    event.stopPropagation()

    if (reducedMotion) return

    wave.current.elapsed = 0
    wave.current.active = true
  }

  useFrame(({ pointer, clock }, delta) => {
    const time = clock.elapsedTime

    // 1. Floating and breathing
    if (body.current) {
      body.current.position.y = reducedMotion
        ? -0.05
        : -0.05 + Math.sin(time * 1.1) * 0.035

      body.current.rotation.z = reducedMotion
        ? 0
        : Math.sin(time * 0.7) * 0.012

      const breath = reducedMotion
        ? 1
        : 1 + Math.sin(time * 1.5) * 0.006

      body.current.scale.set(
        0.78 * breath,
        0.78,
        0.78 * breath
      )
    }

    // 2. Head tracks the cursor
    if (head.current) {
      const targetY = reducedMotion ? 0 : pointer.x * 0.28
      const targetX = reducedMotion ? 0 : -pointer.y * 0.13

      head.current.rotation.y = THREE.MathUtils.damp(
        head.current.rotation.y,
        targetY,
        3.5,
        delta
      )

      head.current.rotation.x = THREE.MathUtils.damp(
        head.current.rotation.x,
        targetX,
        3.5,
        delta
      )

      head.current.rotation.z = reducedMotion
        ? 0
        : Math.sin(time * 0.55) * 0.014
    }

    // 3. Natural blinking
    const blinkState = blink.current

    if (!reducedMotion) {
      blinkState.elapsed += delta

      if (
        blinkState.elapsed >= blinkState.next &&
        blinkState.active <= 0
      ) {
        blinkState.active = 0.2
        blinkState.elapsed = 0
        blinkState.next = 2.7 + Math.random() * 3
      }
    }

    if (eyes.current) {
      if (!reducedMotion && blinkState.active > 0) {
        const progress = 1 - blinkState.active / 0.2

        eyes.current.scale.y = Math.max(
          0.08,
          Math.abs(Math.cos(progress * Math.PI))
        )

        blinkState.active = Math.max(
          0,
          blinkState.active - delta
        )
      } else {
        eyes.current.scale.y = 1
      }
    }

    // 4. Click-to-wave animation
    if (rightArm.current) {
      let targetRotation = 0

      if (wave.current.active && !reducedMotion) {
        wave.current.elapsed += delta

        const duration = 2.2
        const progress = Math.min(
          wave.current.elapsed / duration,
          1
        )

        // Smoothly raise, hold, then lower the arm
        const lift = Math.min(
          1,
          progress / 0.23,
          (1 - progress) / 0.23
        )

        const smoothLift =
          THREE.MathUtils.smoothstep(lift, 0, 1)

        const wiggle =
          Math.sin(progress * Math.PI * 10) * 0.14

        targetRotation =
          (2.35 + wiggle) * smoothLift

        if (progress >= 1) {
          wave.current.active = false
          targetRotation = 0
        }
      }

      rightArm.current.rotation.z = THREE.MathUtils.damp(
        rightArm.current.rotation.z,
        targetRotation,
        12,
        delta
      )
    }
  })

  return (
    <group
      ref={body}
      position={[0, -0.05, 0]}
      scale={0.78}
      onClick={handleWave}
    >
      {/* Hoodie torso */}
      <mesh position={[0, -0.85, 0]}>
        <cylinderGeometry args={[0.57, 0.69, 1.15, 48]} />
        <meshStandardMaterial
          color={COLORS.hoodie}
          roughness={0.82}
        />
      </mesh>

      {/* Rounded lower hem */}
      <mesh
        position={[0, -1.43, 0]}
        scale={[0.68, 0.15, 0.56]}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color={COLORS.hoodieDark} />
      </mesh>

      {/* Hoodie front */}
      <mesh
        position={[0, -0.85, 0.23]}
        scale={[0.55, 0.64, 0.37]}
      >
        <sphereGeometry args={[1, 36, 36]} />
        <meshStandardMaterial color={COLORS.hoodie} />
      </mesh>

      {/* Left arm */}
      <Arm side={-1} />

      {/* Right arm — animated */}
      <Arm side={1} armRef={rightArm} />

      {/* Collar */}
      <mesh
        position={[0, -0.24, 0.06]}
        scale={[0.4, 0.18, 0.4]}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color={COLORS.hoodieDark} />
      </mesh>

      {/* Shorter neck */}
      <mesh position={[0, -0.08, 0]}>
        <cylinderGeometry args={[0.16, 0.2, 0.24, 24]} />
        <meshStandardMaterial color={COLORS.skin} />
      </mesh>

      {/* Hoodie drawstrings */}
      {[-0.14, 0.14].map((x) => (
        <mesh key={x} position={[x, -0.5, 0.51]}>
          <cylinderGeometry args={[0.013, 0.013, 0.4, 12]} />
          <meshStandardMaterial color="#F4EFFF" />
        </mesh>
      ))}

      {/* Kangaroo pocket */}
      <mesh
        position={[0, -1.04, 0.54]}
        scale={[0.41, 0.19, 0.055]}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={COLORS.hoodieDark} />
      </mesh>

      {/* HEAD */}
      <group ref={head} position={[0, 0.7, 0]}>
        {/* Face */}
        <mesh scale={[0.61, 0.73, 0.56]}>
          <sphereGeometry args={[1, 48, 48]} />
          <meshStandardMaterial
            color={COLORS.skin}
            roughness={0.83}
          />
        </mesh>

        {/* Ears and earrings */}
        {[-1, 1].map((side) => (
          <group key={side}>
            <mesh position={[side * 0.61, -0.07, 0]}>
              <sphereGeometry args={[0.12, 24, 24]} />
              <meshStandardMaterial color={COLORS.skin} />
            </mesh>

            <mesh position={[side * 0.63, -0.2, 0.08]}>
              <torusGeometry args={[0.064, 0.013, 10, 32]} />
              <meshStandardMaterial
                color={COLORS.gold}
                metalness={0.65}
                roughness={0.22}
              />
            </mesh>
          </group>
        ))}

        <Hair />

        <group ref={eyes}>
          <Eye x={-0.2} />
          <Eye x={0.2} />
        </group>

        {/* Eyebrows */}
        {[-1, 1].map((side) => (
          <mesh
            key={side}
            position={[side * 0.2, 0.23, 0.5]}
            rotation={[0, 0, side * -0.12]}
          >
            <boxGeometry args={[0.17, 0.027, 0.025]} />
            <meshStandardMaterial color={COLORS.hair} />
          </mesh>
        ))}

        {/* Nose */}
        <mesh
          position={[0, -0.085, 0.56]}
          scale={[0.073, 0.095, 0.07]}
        >
          <sphereGeometry args={[1, 24, 24]} />
          <meshStandardMaterial color={COLORS.skinShadow} />
        </mesh>

        {/* Cheeks */}
        {[-1, 1].map((side) => (
          <mesh
            key={side}
            position={[side * 0.28, -0.17, 0.485]}
            scale={[0.095, 0.045, 0.016]}
          >
            <sphereGeometry args={[1, 20, 20]} />
            <meshStandardMaterial
              color="#E7A5A7"
              transparent
              opacity={0.4}
              depthWrite={false}
            />
          </mesh>
        ))}

        <Smile />
        <Headphones />
      </group>
    </group>
  )
}

export default function Avatar3D() {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const preference = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    )

    const updatePreference = () => {
      setReducedMotion(preference.matches)
    }

    updatePreference()

    preference.addEventListener('change', updatePreference)

    return () => {
      preference.removeEventListener(
        'change',
        updatePreference
      )
    }
  }, [])

  return (
    <Canvas
      camera={{ position: [0, 0.15, 6], fov: 38 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
      style={{ cursor: 'pointer' }}
    >
      <ambientLight intensity={1.65} />

      <directionalLight
        position={[3, 4, 5]}
        intensity={2.1}
      />

      <pointLight
        position={[-3, 1, 3]}
        intensity={1.1}
        color="#D4B4FF"
      />

      <pointLight
        position={[2, -1, 4]}
        intensity={0.7}
        color="#FFE8F4"
      />

      <AvatarCharacter reducedMotion={reducedMotion} />
    </Canvas>
  )
}
