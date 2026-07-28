"use client";

/* eslint-disable react/no-unknown-property */
import * as THREE from 'three';
import { useRef, useState, useEffect, memo } from 'react';
import { Canvas, createPortal, useFrame, useThree } from '@react-three/fiber';
import {
  useFBO,
  useScroll,
  Image,
  Scroll,
  Preload,
  ScrollControls,
  MeshTransmissionMaterial,
  Text,
  RoundedBox
} from '@react-three/drei';
import { easing } from 'maath';

export default function FluidGlass({ mode = 'lens', lensProps = {}, barProps = {}, cubeProps = {} }: any) {
  const Wrapper = mode === 'bar' ? Bar : mode === 'cube' ? Cube : Lens;
  const rawOverrides = mode === 'bar' ? barProps : mode === 'cube' ? cubeProps : lensProps;

  const {
    navItems = [
      { label: 'Home', link: '' },
      { label: 'About', link: '' },
      { label: 'Contact', link: '' }
    ],
    ...modeProps
  } = rawOverrides;

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <Canvas camera={{ position: [0, 0, 20], fov: 15 }} gl={{ alpha: true }}>
        <ScrollControls damping={0.2} pages={3} distance={0.4}>
          {mode === 'bar' && <NavItems items={navItems} />}
          <Wrapper modeProps={modeProps} mode={mode}>
            <Scroll>
              <Typography />
              <TestShapes />
            </Scroll>
            <Scroll html />
            <Preload />
          </Wrapper>
        </ScrollControls>
      </Canvas>
    </div>
  );
}

const ModeWrapper = memo(function ModeWrapper({
  children,
  mode,
  lockToBottom = false,
  followPointer = true,
  modeProps = {},
  ...props
}: any) {
  const ref = useRef<THREE.Mesh>(null);
  const buffer = useFBO();
  const { viewport: vp } = useThree();
  const [scene] = useState(() => new THREE.Scene());

  useFrame((state, delta) => {
    const { gl, viewport, pointer, camera } = state;
    const v = viewport.getCurrentViewport(camera, [0, 0, 15]);

    const destX = followPointer ? (pointer.x * v.width) / 2 : 0;
    const destY = lockToBottom ? -v.height / 2 + 0.2 : followPointer ? (pointer.y * v.height) / 2 : 0;
    
    if (ref.current) {
        easing.damp3(ref.current.position, [destX, destY, 15], 0.15, delta);
        
        if (modeProps.scale == null) {
            ref.current.scale.setScalar(0.15);
        }
    }

    gl.setRenderTarget(buffer);
    gl.render(scene, camera);
    gl.setRenderTarget(null);

    // Background Color (dark so glass pops)
    gl.setClearColor(0x0a0a0a, 1);
  });

  const { scale, ior, thickness, anisotropy, chromaticAberration, ...extraMat } = modeProps;

  return (
    <>
      {createPortal(children, scene)}
      <mesh scale={[vp.width, vp.height, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={buffer.texture} transparent />
      </mesh>
      
      {mode === 'lens' && (
          <mesh ref={ref} scale={scale ?? 0.15} rotation-x={Math.PI / 2} {...props}>
              <cylinderGeometry args={[10, 10, 2, 64]} />
              <MeshTransmissionMaterial
                  buffer={buffer.texture}
                  ior={ior ?? 1.15}
                  thickness={thickness ?? 5}
                  anisotropy={anisotropy ?? 0.01}
                  chromaticAberration={chromaticAberration ?? 0.1}
                  {...extraMat}
              />
          </mesh>
      )}

      {mode === 'cube' && (
          <RoundedBox ref={ref} scale={scale ?? 0.15} args={[10, 10, 10]} radius={1} smoothness={4} {...props}>
               <MeshTransmissionMaterial
                  buffer={buffer.texture}
                  ior={ior ?? 1.15}
                  thickness={thickness ?? 5}
                  anisotropy={anisotropy ?? 0.01}
                  chromaticAberration={chromaticAberration ?? 0.1}
                  {...extraMat}
              />
          </RoundedBox>
      )}

      {mode === 'bar' && (
          <RoundedBox ref={ref} scale={scale ?? 0.15} args={[30, 4, 2]} radius={1} smoothness={4} {...props}>
               <MeshTransmissionMaterial
                  buffer={buffer.texture}
                  ior={ior ?? 1.15}
                  thickness={thickness ?? 5}
                  anisotropy={anisotropy ?? 0.01}
                  chromaticAberration={chromaticAberration ?? 0.1}
                  {...extraMat}
              />
          </RoundedBox>
      )}
    </>
  );
});

function Lens({ modeProps, ...p }: any) {
  return <ModeWrapper mode="lens" followPointer modeProps={modeProps} {...p} />;
}

function Cube({ modeProps, ...p }: any) {
  return <ModeWrapper mode="cube" followPointer modeProps={modeProps} {...p} />;
}

function Bar({ modeProps = {}, ...p }: any) {
  const defaultMat = {
    transmission: 1,
    roughness: 0,
    thickness: 10,
    ior: 1.15,
    color: '#ffffff',
    attenuationColor: '#ffffff',
    attenuationDistance: 0.25
  };

  return (
    <ModeWrapper
      mode="bar"
      lockToBottom
      followPointer={false}
      modeProps={{ ...defaultMat, ...modeProps }}
      {...p}
    />
  );
}

function NavItems({ items }: any) {
  const group = useRef<THREE.Group>(null);
  const { viewport, camera } = useThree();

  const spacing = 0.3;
  const fontSize = 0.035;

  useFrame(() => {
    if (!group.current) return;
    const v = viewport.getCurrentViewport(camera, [0, 0, 15]);
    group.current.position.set(0, -v.height / 2 + 0.2, 15.1);

    group.current.children.forEach((child, i) => {
      child.position.x = (i - (items.length - 1) / 2) * spacing;
    });
  });

  return (
    <group ref={group} renderOrder={10}>
      {items.map(({ label, link }: any) => (
        <Text
          key={label}
          fontSize={fontSize}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0}
          outlineBlur="20%"
          outlineColor="#000"
          outlineOpacity={0.5}
          renderOrder={10}
        >
          {label}
        </Text>
      ))}
    </group>
  );
}

// Replaced Images with colored 3D shapes to avoid missing .webp file errors
function TestShapes() {
  const group = useRef<THREE.Group>(null);
  const data = useScroll();

  useFrame(() => {
    if(!group.current) return;
    group.current.children[0].scale.setScalar(1 + data.range(0, 1 / 3) / 3);
    group.current.children[1].scale.setScalar(1 + data.range(0, 1 / 3) / 3);
  });

  return (
    <group ref={group}>
      <mesh position={[-2, 0, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#0505A9" />
      </mesh>
      <mesh position={[2, 0, 3]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial color="#10B981" />
      </mesh>
      <ambientLight intensity={2} />
      <directionalLight position={[10, 10, 10]} />
    </group>
  );
}

function Typography() {
  const fontSize = 0.6;
  return (
    <Text
      position={[0, 0, 12]}
      fontSize={fontSize}
      letterSpacing={-0.05}
      outlineWidth={0}
      outlineBlur="20%"
      outlineColor="#000"
      outlineOpacity={0.5}
      color="white"
      anchorX="center"
      anchorY="middle"
    >
      React Bits Lens
    </Text>
  );
}
