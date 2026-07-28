"use client";

import * as THREE from "three";
import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshTransmissionMaterial, RoundedBox, Environment } from "@react-three/drei";
import { easing } from "maath";

function GlassPill() {
    const meshRef = useRef<THREE.Mesh>(null);
    const { viewport, pointer } = useThree();

    // Use Maath for smooth easing following pointer slightly
    useFrame((state, delta) => {
        if (meshRef.current) {
            // Subtle tilt based on mouse position
            const destX = (pointer.x * Math.PI) / 16;
            const destY = -(pointer.y * Math.PI) / 32;
            
            easing.dampE(meshRef.current.rotation, [destY, destX, 0], 0.25, delta);
        }
    });

    // The dimensions of the pill match the viewport of this specific canvas
    // We scale the RoundedBox to fit exactly.
    return (
        <RoundedBox 
            ref={meshRef} 
            args={[viewport.width * 0.98, viewport.height * 0.9, 0.5]} 
            radius={viewport.height * 0.45} 
            smoothness={32}
        >
            <MeshTransmissionMaterial
                backside
                samples={4}
                thickness={0.5}
                roughness={0}
                transmission={1}
                ior={1.15}
                chromaticAberration={0.05}
                anisotropy={0.1}
                color="#ffffff"
            />
        </RoundedBox>
    );
}

export default function FluidHeaderBackground() {
    return (
        <div className="absolute inset-[-10px] z-[-1] overflow-visible pointer-events-none">
            <Canvas camera={{ position: [0, 0, 5], fov: 35 }} gl={{ alpha: true }}>
                <ambientLight intensity={1} />
                <directionalLight position={[10, 10, 5]} intensity={1.5} />
                <Environment preset="city" />
                <GlassPill />
            </Canvas>
        </div>
    );
}
