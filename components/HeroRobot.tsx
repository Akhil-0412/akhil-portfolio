"use client";

import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import * as THREE from "three";
import useProjectStore from "../store/useProjectStore";
import useCertStore from "../store/useCertStore";
import useNavStore, { SectionId } from "../store/useNavStore";

// ── PER-SECTION IDLE POSES ───────────────────────────────────────────────────
// Where the robot stands while a given dock section is active. Two "zones":
// left, beside text-heavy content (About/Experience/Certifications/Contact),
// and centered, for showcase moments (Projects/Skills). Certifications keeps
// the same base as About/Experience so the existing certXOffset/certYOffset/
// certYRot swipe-choreography (below) — which is tuned to cancel exactly this
// base — still lands centered while the user is actually swiping the deck.
const SECTION_POSES: Record<SectionId, { x: number; y: number; z: number; rotY: number }> = {
  hero:           { x: 0,    y: 0,   z: 0,   rotY: 0 },
  about:          { x: -1.5, y: 0.6, z: 0,   rotY: 0.55 },
  experience:     { x: -1.5, y: 0.6, z: 0,   rotY: 0.55 },
  certifications: { x: -1.5, y: 0.6, z: 0,   rotY: 0.55 },
  projects:       { x: 0,    y: 0,   z: 0.1, rotY: 0 },
  skills:         { x: 0,    y: 0,   z: 0.1, rotY: 0 },
  contact:        { x: -1.5, y: 0.6, z: 0,   rotY: 0.55 },
};

// Where the robot stands while the AI chat is open — deliberately independent
// of whichever section was active, so opening chat "deselects" the section
// pose. Closing chat re-reads the (unchanged, since scroll is locked while
// chat is open) active section and returns exactly there.
// Held to the left so the chat column (centred on the right half of the
// viewport) has clear space, and turned slightly to face it. The speech bubble
// tracks the head via --ai-head-x/y, so it follows the robot across.
const AI_CHAT_POSE = { x: -2.0, y: 0.3, z: 0.1, rotY: 0.5 };

// ── PROJECT HOVER POSE DEFINITIONS ───────────────────────────────────────────
interface ProjectPose {
  bot_x: number; bot_y: number; bot_z: number; bot_rot_y: number;
  l_sh: [number, number, number]; l_el: [number, number, number]; l_hd: [number, number, number];
  r_sh: [number, number, number]; r_el: [number, number, number]; r_hd: [number, number, number];
  headTwist?: number; // Optional override for head rotation (PULSE)
  l_thumb_z?: number; l_index_z?: number; l_mid_z?: number; l_ring_z?: number; l_pinky_z?: number;
  r_thumb_z?: number; r_index_z?: number; r_mid_z?: number; r_ring_z?: number; r_pinky_z?: number;
}

const PROJECT_POSES: Record<string, ProjectPose> = {
  // Compliance Analyst — top right
  'compliance-analyst': {
    bot_x: 3.7, bot_y: 0.8, bot_z: -1.7, bot_rot_y: -1.20,
    l_sh: [-0.10, 1.00, -0.60], l_el: [2.00, -0.40, 0.35], l_hd: [-2.90, -0.10, 0.50],
    r_sh: [-1.05, -1.55, -0.60], r_el: [0.45, 0.50, -0.50], r_hd: [-0.85, -0.15, 0.05],
  },
  // PULSE Dissertation — bottom right
  'pulse-project': {
    bot_x: 3.6, bot_y: -0.7, bot_z: -1.2, bot_rot_y: -1.10,
    l_sh: [0.50, 1.25, -1.20], l_el: [-2.50, -2.30, -2.75], l_hd: [-2.55, -0.50, -0.60],
    r_sh: [0.00, -0.10, -0.15], r_el: [-1.65, 0.30, -0.65], r_hd: [-0.85, -0.25, 0.05],
    headTwist: 0.6, // Boosted right-look
  },
  // Formula F1 — top left
  'f1-podium-predictor': {
    bot_x: -3.5, bot_y: 0.8, bot_z: -3.2, bot_rot_y: 1.20,
    l_sh: [-1.15, -0.60, -1.30], l_el: [-1.45, 2.20, -2.75], l_hd: [-2.30, 0.40, 0.25],
    r_sh: [0.50, 0.20, -0.75], r_el: [-1.65, 0.30, -0.65], r_hd: [-0.15, -0.25, 0.15],
  },
  // Autognosis (Smart SaaS) — bottom left
  'smart-saas': {
    bot_x: -3.5, bot_y: -1.3, bot_z: -3.2, bot_rot_y: 1.20,
    l_sh: [0.45, 0.80, -1.30], l_el: [1.35, 3.14, -2.45], l_hd: [0.60, -0.35, 0.70],
    r_sh: [-1.00, 0.30, -0.75], r_el: [-0.75, 0.20, -0.30], r_hd: [1.40, -0.20, 0.15],
  },
  // Crown & Crest Hotel AI — center
  'ai-hotel-receptionist': {
    bot_x: 0.0, bot_y: 0.0, bot_z: 0.1, bot_rot_y: 0.00,
    l_sh: [-0.60, -0.50, 0.35], l_el: [-1.40, 0.40, -1.30], l_hd: [-0.70, 0.10, -0.25],
    r_sh: [-0.15, -0.60, -0.10], r_el: [-2.00, 0.05, -1.20], r_hd: [-0.50, 0.15, -0.30],
  },
};

const CERT_POSES: Record<string, ProjectPose> = {
  'right': {
    bot_x: 0.0, bot_y: 0.0, bot_z: 0.0, bot_rot_y: 0.00,
    l_sh: [0.00, 0.00, 0.00], l_el: [0.00, 0.00, 0.00], l_hd: [0.00, 0.00, 0.00],
    r_sh: [-0.90, 0.10, 0.25], r_el: [-2.35, 1.10, 2.90], r_hd: [0.00, 0.00, -0.10],
  },
  'left': {
    bot_x: 0.0, bot_y: 0.0, bot_z: 0.0, bot_rot_y: 0.00,
    l_sh: [-0.25, -0.10, 0.10], l_el: [0.35, 2.20, -0.10], l_hd: [0.10, 0.00, 0.00],
    r_sh: [0.00, 0.00, 0.00], r_el: [0.00, 0.00, 0.00], r_hd: [0.00, 0.00, 0.00],
  },
  'neutral': {
    bot_x: 0.0, bot_y: 0.0, bot_z: 0.0, bot_rot_y: 0.0,
    l_sh: [0, 0, 0], l_el: [0, 0, 0], l_hd: [0, 0, 0],
    r_sh: [0, 0, 0], r_el: [0, 0, 0], r_hd: [0, 0, 0],
  }
};

const HEAD_TWIST_CLAMP = 0.8; // ±0.8 rad (~45°)

function RobotModel() {
  const { scene } = useGLTF("/models/robot_character.glb");
  const modelRef = useRef<THREE.Group>(null);

  const poseControls = {
    bot_x: 0, bot_y: 0, bot_z: 0, bot_rot_y: 0,
    l_sh_x: -0.2, l_sh_y: 0.25, l_sh_z: -0.5,
    l_el_x: 1.2, l_el_y: -0.4, l_el_z: -0.2,
    l_hd_x: -2.9, l_hd_y: 0.0, l_hd_z: 0.5,
    l_thumb_z: 0, l_index_z: 0, l_mid_z: 0, l_ring_z: 0, l_pinky_z: 0,
    r_sh_x: -0.2, r_sh_y: 0.2, r_sh_z: -0.6,
    r_el_x: -0.5, r_el_y: 0.95, r_el_z: 0.25,
    r_hd_x: -0.8, r_hd_y: -0.2, r_hd_z: -0.1,
    r_thumb_z: 0, r_index_z: 0, r_mid_z: 0, r_ring_z: 0, r_pinky_z: 0,
    forcePose: false
  };

  // Bone references
  const headBoneRef = useRef<THREE.Object3D | null>(null);
  const neckBoneRef = useRef<THREE.Object3D | null>(null);
  const spineBoneRef = useRef<THREE.Object3D | null>(null);

  // Arm & Hand Bone references
  const leftArmRef = useRef<THREE.Object3D | null>(null);
  const rightArmRef = useRef<THREE.Object3D | null>(null);
  const leftForearmRef = useRef<THREE.Object3D | null>(null);
  const rightForearmRef = useRef<THREE.Object3D | null>(null);
  const leftHandRef = useRef<THREE.Object3D | null>(null);
  const rightHandRef = useRef<THREE.Object3D | null>(null);

  // Initial base rotations (captured once on load)
  const initialLeftArmRot = useRef<THREE.Euler | null>(null);
  const initialRightArmRot = useRef<THREE.Euler | null>(null);
  const initialLeftForearmRot = useRef<THREE.Euler | null>(null);
  const initialRightForearmRot = useRef<THREE.Euler | null>(null);
  const initialLeftHandRot = useRef<THREE.Euler | null>(null);
  const initialRightHandRot = useRef<THREE.Euler | null>(null);

  // Finger references
  const leftThumbRef = useRef<THREE.Object3D[]>([]);
  const leftIndexRef = useRef<THREE.Object3D[]>([]);
  const leftMiddleRef = useRef<THREE.Object3D[]>([]);
  const leftRingRef = useRef<THREE.Object3D[]>([]);
  const leftPinkyRef = useRef<THREE.Object3D[]>([]);
  const rightThumbRef = useRef<THREE.Object3D[]>([]);
  const rightIndexRef = useRef<THREE.Object3D[]>([]);
  const rightMiddleRef = useRef<THREE.Object3D[]>([]);
  const rightRingRef = useRef<THREE.Object3D[]>([]);
  const rightPinkyRef = useRef<THREE.Object3D[]>([]);

  const initialLeftThumbRot = useRef<THREE.Euler[]>([]);
  const initialLeftIndexRot = useRef<THREE.Euler[]>([]);
  const initialLeftMiddleRot = useRef<THREE.Euler[]>([]);
  const initialLeftRingRot = useRef<THREE.Euler[]>([]);
  const initialLeftPinkyRot = useRef<THREE.Euler[]>([]);
  const initialRightThumbRot = useRef<THREE.Euler[]>([]);
  const initialRightIndexRot = useRef<THREE.Euler[]>([]);
  const initialRightMiddleRot = useRef<THREE.Euler[]>([]);
  const initialRightRingRot = useRef<THREE.Euler[]>([]);
  const initialRightPinkyRot = useRef<THREE.Euler[]>([]);

  // Global window mouse coordinates (-1 to 1)
  const globalMouse = useRef({ x: 0, y: 0 });
  const smoothedTarget = useRef({ x: 0, y: 0 });

  // Track mount time for animations
  const mountedTime = useRef<number | null>(null);

  // Cert progress (0-1): driven by window event from page.tsx's spring
  const certProgressRef = useRef(0);

  useEffect(() => {
    const handler = (e: Event) => {
      certProgressRef.current = (e as CustomEvent<number>).detail;
    };
    window.addEventListener("__cert_progress__" as keyof WindowEventMap, handler);
    return () => window.removeEventListener("__cert_progress__" as keyof WindowEventMap, handler);
  }, []);

  useEffect(() => {
    mountedTime.current = Date.now();
  }, []);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      globalMouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      globalMouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  useEffect(() => {
    if (!scene) return;

    scene.rotation.set(0, 0, 0);

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          if (mat.name === "Emission") {
            mat.emissive = new THREE.Color("#00ff00ff");
            mat.emissiveIntensity = -0.1;
            mat.color = new THREE.Color("#00aa00");
          }
        }
      }

      if (child.name) {
        const n = child.name.toLowerCase();
        if (!headBoneRef.current && n.includes("head")) {
          headBoneRef.current = child;
        } else if (!neckBoneRef.current && n.includes("neck")) {
          neckBoneRef.current = child;
        } else if (!spineBoneRef.current && (n.includes("spine_05") || n.includes("spine_03"))) {
          spineBoneRef.current = child;
        } else if (!leftArmRef.current && (n.includes("upperarm_l") || n.includes("arm_l_012"))) {
          leftArmRef.current = child;
          initialLeftArmRot.current = child.rotation.clone();
        } else if (!rightArmRef.current && (n.includes("upperarm_r") || n.includes("arm_r_058"))) {
          rightArmRef.current = child;
          initialRightArmRot.current = child.rotation.clone();
        } else if (!leftForearmRef.current && n.includes("lowerarm_l")) {
          leftForearmRef.current = child;
          initialLeftForearmRot.current = child.rotation.clone();
        } else if (!rightForearmRef.current && n.includes("lowerarm_r")) {
          rightForearmRef.current = child;
          initialRightForearmRot.current = child.rotation.clone();
        } else if (!leftHandRef.current && n.includes("hand_l")) {
          leftHandRef.current = child;
          initialLeftHandRot.current = child.rotation.clone();
        } else if (!rightHandRef.current && n.includes("hand_r")) {
          rightHandRef.current = child;
          initialRightHandRot.current = child.rotation.clone();
        } else if (n.match(/thumb_0[123]_l/)) {
          leftThumbRef.current.push(child);
          initialLeftThumbRot.current.push(child.rotation.clone());
        } else if (n.match(/index_0[123]_l/)) {
          leftIndexRef.current.push(child);
          initialLeftIndexRot.current.push(child.rotation.clone());
        } else if (n.match(/middle_0[123]_l/)) {
          leftMiddleRef.current.push(child);
          initialLeftMiddleRot.current.push(child.rotation.clone());
        } else if (n.match(/ring_0[123]_l/)) {
          leftRingRef.current.push(child);
          initialLeftRingRot.current.push(child.rotation.clone());
        } else if (n.match(/pinky_0[123]_l/)) {
          leftPinkyRef.current.push(child);
          initialLeftPinkyRot.current.push(child.rotation.clone());
        } else if (n.match(/thumb_0[123]_r/)) {
          rightThumbRef.current.push(child);
          initialRightThumbRot.current.push(child.rotation.clone());
        } else if (n.match(/index_0[123]_r/)) {
          rightIndexRef.current.push(child);
          initialRightIndexRot.current.push(child.rotation.clone());
        } else if (n.match(/middle_0[123]_r/)) {
          rightMiddleRef.current.push(child);
          initialRightMiddleRot.current.push(child.rotation.clone());
        } else if (n.match(/ring_0[123]_r/)) {
          rightRingRef.current.push(child);
          initialRightRingRot.current.push(child.rotation.clone());
        } else if (n.match(/pinky_0[123]_r/)) {
          rightPinkyRef.current.push(child);
          initialRightPinkyRot.current.push(child.rotation.clone());
        }
      }
    });

    if (!headBoneRef.current) {
      headBoneRef.current = scene.getObjectByName("head_010") || scene.getObjectByName("head") || null;
    }

    if (neckBoneRef.current) {
      neckBoneRef.current.rotation.z = 0;
      neckBoneRef.current.rotation.y = 0;
    }
    if (headBoneRef.current) {
      headBoneRef.current.rotation.z = 0;
      headBoneRef.current.rotation.y = 0;
    }
    if (spineBoneRef.current) {
      spineBoneRef.current.rotation.z = 0;
    }
  }, [scene]);

  useFrame((state, delta) => {
    const now = Date.now();
    const scrollY = typeof window !== "undefined" ? window.scrollY : 0;

    // certProgress: 0 = outside certs, 1 = fully in view
    // Driven by the __cert_progress__ window event from page.tsx
    const certProgress = certProgressRef.current;

    // ── Hero → side scroll transition ────────────────────────────────────────
    const scrollProgress = Math.min(scrollY / 500, 1.0);

    const activePointerX = globalMouse.current.x !== 0 ? globalMouse.current.x : state.pointer.x;
    const activePointerY = globalMouse.current.y !== 0 ? globalMouse.current.y : state.pointer.y;

    // --- FIX: Target smoothing & frame-rate independent exponential decay ---
    const dtClamped = Math.min(delta, 1 / 30);
    const getFactor = (halfLife: number) => 1 - Math.pow(0.5, dtClamped / halfLife);

    // Smooth raw mouse target (0.05s half-life)
    const targetFactor = getFactor(0.05);
    smoothedTarget.current.x = THREE.MathUtils.lerp(smoothedTarget.current.x, activePointerX, targetFactor);
    smoothedTarget.current.y = THREE.MathUtils.lerp(smoothedTarget.current.y, activePointerY, targetFactor);

    const targetX = smoothedTarget.current.x * 1.25;
    const targetY = smoothedTarget.current.y * -2.25;

    // Define standard decay factors for all bone animations
    const fastFactor = getFactor(0.12);  // Quick tracking (was delta*20)
    const medFactor = getFactor(0.18);   // Medium tracking (was delta*8 to delta*5)
    const normFactor = getFactor(0.25);  // Normal body sways (was delta*4)
    const slowFactor = getFactor(0.33);  // Hover pose transitions (was delta*3, delta*2.5)

    if (!mountedTime.current) return;
    const t = (Date.now() - mountedTime.current) / 1000;

    // ── PROJECT HOVER STATE (read from zustand on every tick — no stale closure) ─
    const hoveredProjectId = useProjectStore.getState().hoveredProjectId;
    const activePose = hoveredProjectId ? PROJECT_POSES[hoveredProjectId] : null;
    const isProjectHover = activePose !== null;

    // ── CERT HOVER STATE ──
    const activeSwipe = useCertStore.getState().activeSwipe;

    // ── HEAD: mouse tracking — SUSPENDED during project hover ─────────────────
    if (headBoneRef.current && !isProjectHover) {
      headBoneRef.current.rotation.x = THREE.MathUtils.lerp(
        headBoneRef.current.rotation.x,
        targetX * 0.7,
        fastFactor
      );
      headBoneRef.current.rotation.z = THREE.MathUtils.lerp(
        headBoneRef.current.rotation.z,
        -targetY * 0.25 - 0.4,
        medFactor
      );
      headBoneRef.current.rotation.y = 0;
    }

    // ── HEAD: project hover pose — direct target with optional PULSE twist ────
    if (headBoneRef.current && isProjectHover) {
      const twist = activePose.headTwist
        ? THREE.MathUtils.clamp(activePose.headTwist, -HEAD_TWIST_CLAMP, HEAD_TWIST_CLAMP)
        : 0;
      headBoneRef.current.rotation.x = THREE.MathUtils.lerp(
        headBoneRef.current.rotation.x, twist, normFactor
      );
      headBoneRef.current.rotation.z = THREE.MathUtils.lerp(
        headBoneRef.current.rotation.z, -0.4, normFactor
      );
      headBoneRef.current.rotation.y = THREE.MathUtils.lerp(
        headBoneRef.current.rotation.y, 0, normFactor
      );
    }

    // ── TRACK HEAD BONE 2D POSITION FOR AI CHAT WIDGET ──
    if (headBoneRef.current) {
      const vector = new THREE.Vector3();
      headBoneRef.current.getWorldPosition(vector);
      vector.project(state.camera);
      // CSS viewport width/height tracking
      const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
      const y = -(vector.y * 0.5 - 0.5) * window.innerHeight;
      document.documentElement.style.setProperty('--ai-head-x', `${x}px`);
      document.documentElement.style.setProperty('--ai-head-y', `${y}px`);
    }

    // ── SPINE: mouse tracking + breathing — SUSPENDED during project hover ────
    if (spineBoneRef.current && !isProjectHover) {
      spineBoneRef.current.rotation.x = THREE.MathUtils.lerp(
        spineBoneRef.current.rotation.x,
        targetX * 0.2,
        normFactor
      );
      const breathIntensity = 0.015 + certProgress * 0.006;
      const breath = Math.sin(t * 1.5) * breathIntensity;
      spineBoneRef.current.rotation.z = THREE.MathUtils.lerp(
        spineBoneRef.current.rotation.z,
        breath,
        normFactor
      );
    }
    if (spineBoneRef.current && isProjectHover) {
      // Gently return spine to neutral during hover
      spineBoneRef.current.rotation.x = THREE.MathUtils.lerp(
        spineBoneRef.current.rotation.x, 0, normFactor
      );
      spineBoneRef.current.rotation.z = THREE.MathUtils.lerp(
        spineBoneRef.current.rotation.z, 0, normFactor
      );
    }

    // ── HELPERS ───────────────────────────────────────────────────────────────
    const eulerHelper = new THREE.Euler();
    const quatHelper  = new THREE.Quaternion();

    // ── INITIAL WAVE GREETING (one-shot on page load, disabled during certs) ──
    const isInitialGreeting = t > 1.5 && t < 3.2 && certProgress === 0 && !poseControls.forcePose && !isProjectHover;

    if (isInitialGreeting && leftArmRef.current && initialLeftArmRot.current) {
      const baseArm     = initialLeftArmRot.current;
      const baseForearm = initialLeftForearmRot.current;
      const baseHand    = initialLeftHandRot.current;

      const armWave = Math.sin((t - 1.5) * 8) * 0.3;
      eulerHelper.set(baseArm.x - 1, baseArm.y - 0.65, baseArm.z - 0.5 + armWave);
      quatHelper.setFromEuler(eulerHelper);
      leftArmRef.current.quaternion.slerp(quatHelper, medFactor);

      if (leftForearmRef.current && baseForearm) {
        eulerHelper.set(baseForearm.x, baseForearm.y - 1, baseForearm.z - 0.5);
        quatHelper.setFromEuler(eulerHelper);
        leftForearmRef.current.quaternion.slerp(quatHelper, medFactor);
      }
      if (leftHandRef.current && baseHand) {
        eulerHelper.set(baseHand.x - 1.6, baseHand.y, baseHand.z);
        quatHelper.setFromEuler(eulerHelper);
        leftHandRef.current.quaternion.slerp(quatHelper, medFactor);
      }
      if (spineBoneRef.current) {
        spineBoneRef.current.rotation.y = THREE.MathUtils.lerp(
          spineBoneRef.current.rotation.y, -0.08, normFactor
        );
      }
      if (rightArmRef.current && initialRightArmRot.current) {
        const rBase = initialRightArmRot.current;
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, rBase.x + 0.15, normFactor);
        rightArmRef.current.rotation.y = THREE.MathUtils.lerp(rightArmRef.current.rotation.y, rBase.y - 0.2,  normFactor);
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, rBase.z + 0.05, normFactor);
      }

    } else if (certProgress > 0.01 || poseControls.forcePose) {
      // ── CERTIFICATION ARROW CLICK POSE OR LEVA CONTROLS ─────────────────────
      const p = poseControls.forcePose ? 1 : certProgress;
      const cp = (poseControls.forcePose ? {
        bot_x: poseControls.bot_x, bot_y: poseControls.bot_y, bot_z: poseControls.bot_z, bot_rot_y: poseControls.bot_rot_y,
        l_sh: [poseControls.l_sh_x, poseControls.l_sh_y, poseControls.l_sh_z],
        l_el: [poseControls.l_el_x, poseControls.l_el_y, poseControls.l_el_z],
        l_hd: [poseControls.l_hd_x, poseControls.l_hd_y, poseControls.l_hd_z],
        r_sh: [poseControls.r_sh_x, poseControls.r_sh_y, poseControls.r_sh_z],
        r_el: [poseControls.r_el_x, poseControls.r_el_y, poseControls.r_el_z],
        r_hd: [poseControls.r_hd_x, poseControls.r_hd_y, poseControls.r_hd_z],
        l_thumb_z: poseControls.l_thumb_z, l_index_z: poseControls.l_index_z, l_mid_z: poseControls.l_mid_z, l_ring_z: poseControls.l_ring_z, l_pinky_z: poseControls.l_pinky_z,
        r_thumb_z: poseControls.r_thumb_z, r_index_z: poseControls.r_index_z, r_mid_z: poseControls.r_mid_z, r_ring_z: poseControls.r_ring_z, r_pinky_z: poseControls.r_pinky_z
      } : (activeSwipe ? CERT_POSES[activeSwipe] : CERT_POSES['neutral'])) as ProjectPose;
      const cSpeed = slowFactor;

      // Left Shoulder
      if (leftArmRef.current && initialLeftArmRot.current) {
        const b = initialLeftArmRot.current;
        eulerHelper.set(b.x + cp.l_sh[0], b.y + cp.l_sh[1], b.z + cp.l_sh[2]);
        quatHelper.setFromEuler(eulerHelper);
        leftArmRef.current.quaternion.slerp(quatHelper, cSpeed);
      }

      // Left Elbow
      if (leftForearmRef.current && initialLeftForearmRot.current) {
        const b = initialLeftForearmRot.current;
        eulerHelper.set(b.x + cp.l_el[0], b.y + cp.l_el[1], b.z + cp.l_el[2]);
        quatHelper.setFromEuler(eulerHelper);
        leftForearmRef.current.quaternion.slerp(quatHelper, cSpeed);
      }

      // Left Hand
      if (leftHandRef.current && initialLeftHandRot.current) {
        const b = initialLeftHandRot.current;
        eulerHelper.set(b.x + cp.l_hd[0], b.y + cp.l_hd[1], b.z + cp.l_hd[2]);
        quatHelper.setFromEuler(eulerHelper);
        leftHandRef.current.quaternion.slerp(quatHelper, cSpeed);
      }

      // Right Shoulder
      if (rightArmRef.current && initialRightArmRot.current) {
        const b = initialRightArmRot.current;
        eulerHelper.set(b.x + cp.r_sh[0], b.y + cp.r_sh[1], b.z + cp.r_sh[2]);
        quatHelper.setFromEuler(eulerHelper);
        rightArmRef.current.quaternion.slerp(quatHelper, cSpeed);
      }

      // Right Elbow
      if (rightForearmRef.current && initialRightForearmRot.current) {
        const b = initialRightForearmRot.current;
        eulerHelper.set(b.x + cp.r_el[0], b.y + cp.r_el[1], b.z + cp.r_el[2]);
        quatHelper.setFromEuler(eulerHelper);
        rightForearmRef.current.quaternion.slerp(quatHelper, cSpeed);
      }

      // Right Hand
      if (rightHandRef.current && initialRightHandRot.current) {
        const b = initialRightHandRot.current;
        eulerHelper.set(b.x + cp.r_hd[0], b.y + cp.r_hd[1], b.z + cp.r_hd[2]);
        quatHelper.setFromEuler(eulerHelper);
        rightHandRef.current.quaternion.slerp(quatHelper, cSpeed);
      }

      // Fingers: all at rest (0 offset) during certs unless defined
      const l_fingers = [leftThumbRef, leftIndexRef, leftMiddleRef, leftRingRef, leftPinkyRef];
      const r_fingers = [rightThumbRef, rightIndexRef, rightMiddleRef, rightRingRef, rightPinkyRef];
      const initial_l_fingers = [initialLeftThumbRot, initialLeftIndexRot, initialLeftMiddleRot, initialLeftRingRot, initialLeftPinkyRot];
      const initial_r_fingers = [initialRightThumbRot, initialRightIndexRot, initialRightMiddleRot, initialRightRingRot, initialRightPinkyRot];
      
      // Values for left fingers from CERT_POSES if defined
      const cp_l_fingers = cp['l_thumb_z'] !== undefined ? [cp.l_thumb_z, cp.l_index_z, cp.l_mid_z, cp.l_ring_z, cp.l_pinky_z] : [0,0,0,0,0];
      const cp_r_fingers = cp['r_thumb_z'] !== undefined ? [cp.r_thumb_z, cp.r_index_z, cp.r_mid_z, cp.r_ring_z, cp.r_pinky_z] : [0,0,0,0,0];

      for(let f=0; f<5; f++) {
         l_fingers[f].current.forEach((bone, i) => {
            const initial = initial_l_fingers[f].current[i];
            if (initial) bone.rotation.z = THREE.MathUtils.lerp(bone.rotation.z, initial.z + (cp_l_fingers[f] || 0), p);
         });
         r_fingers[f].current.forEach((bone, i) => {
            const initial = initial_r_fingers[f].current[i];
            if (initial) bone.rotation.z = THREE.MathUtils.lerp(bone.rotation.z, initial.z + (cp_r_fingers[f] || 0), p);
         });
      }

    } else if (isProjectHover && activePose) {
      // ── PROJECT HOVER POSE ──────────────────────────────────────────────────
      // Full quaternion slerp for all bones. activePose values are offsets from
      // the initial bone rotations (same convention as certProgress poses).

      const hp = activePose; // shorthand
      const hSpeed = slowFactor; // Smooth but responsive transition speed

      // Left Shoulder
      if (leftArmRef.current && initialLeftArmRot.current) {
        const b = initialLeftArmRot.current;
        eulerHelper.set(b.x + hp.l_sh[0], b.y + hp.l_sh[1], b.z + hp.l_sh[2]);
        quatHelper.setFromEuler(eulerHelper);
        leftArmRef.current.quaternion.slerp(quatHelper, hSpeed);
      }

      // Left Elbow (ZYX order to avoid gimbal lock)
      if (leftForearmRef.current && initialLeftForearmRot.current) {
        const b = initialLeftForearmRot.current;
        eulerHelper.set(b.x, b.y, b.z, 'XYZ');
        const baseQ = new THREE.Quaternion().setFromEuler(eulerHelper);
        const offE = new THREE.Euler(hp.l_el[0], hp.l_el[1], hp.l_el[2], 'ZYX');
        const targetQ = baseQ.multiply(new THREE.Quaternion().setFromEuler(offE));
        leftForearmRef.current.quaternion.slerp(targetQ, hSpeed);
      }

      // Left Hand
      if (leftHandRef.current && initialLeftHandRot.current) {
        const b = initialLeftHandRot.current;
        eulerHelper.set(b.x + hp.l_hd[0], b.y + hp.l_hd[1], b.z + hp.l_hd[2]);
        quatHelper.setFromEuler(eulerHelper);
        leftHandRef.current.quaternion.slerp(quatHelper, hSpeed);
      }

      // Right Shoulder
      if (rightArmRef.current && initialRightArmRot.current) {
        const b = initialRightArmRot.current;
        eulerHelper.set(b.x + hp.r_sh[0], b.y + hp.r_sh[1], b.z + hp.r_sh[2]);
        quatHelper.setFromEuler(eulerHelper);
        rightArmRef.current.quaternion.slerp(quatHelper, hSpeed);
      }

      // Right Elbow (ZYX order)
      if (rightForearmRef.current && initialRightForearmRot.current) {
        const b = initialRightForearmRot.current;
        eulerHelper.set(b.x, b.y, b.z, 'XYZ');
        const baseQ = new THREE.Quaternion().setFromEuler(eulerHelper);
        const offE = new THREE.Euler(hp.r_el[0], hp.r_el[1], hp.r_el[2], 'ZYX');
        const targetQ = baseQ.multiply(new THREE.Quaternion().setFromEuler(offE));
        rightForearmRef.current.quaternion.slerp(targetQ, hSpeed);
      }

      // Right Hand
      if (rightHandRef.current && initialRightHandRot.current) {
        const b = initialRightHandRot.current;
        eulerHelper.set(b.x + hp.r_hd[0], b.y + hp.r_hd[1], b.z + hp.r_hd[2]);
        quatHelper.setFromEuler(eulerHelper);
        rightHandRef.current.quaternion.slerp(quatHelper, hSpeed);
      }

      // Fingers: all at rest (0 offset) during project hover
      // Left fingers
      leftThumbRef.current.forEach((bone, i) => {
        const initial = initialLeftThumbRot.current[i];
        if (initial) bone.rotation.z = THREE.MathUtils.lerp(bone.rotation.z, initial.z, hSpeed);
      });
      leftIndexRef.current.forEach((bone, i) => {
        const initial = initialLeftIndexRot.current[i];
        if (initial) bone.rotation.z = THREE.MathUtils.lerp(bone.rotation.z, initial.z, hSpeed);
      });
      leftMiddleRef.current.forEach((bone, i) => {
        const initial = initialLeftMiddleRot.current[i];
        if (initial) bone.rotation.z = THREE.MathUtils.lerp(bone.rotation.z, initial.z, hSpeed);
      });
      leftRingRef.current.forEach((bone, i) => {
        const initial = initialLeftRingRot.current[i];
        if (initial) bone.rotation.z = THREE.MathUtils.lerp(bone.rotation.z, initial.z, hSpeed);
      });
      leftPinkyRef.current.forEach((bone, i) => {
        const initial = initialLeftPinkyRot.current[i];
        if (initial) bone.rotation.z = THREE.MathUtils.lerp(bone.rotation.z, initial.z, hSpeed);
      });
      // Right fingers
      rightThumbRef.current.forEach((bone, i) => {
        const initial = initialRightThumbRot.current[i];
        if (initial) bone.rotation.z = THREE.MathUtils.lerp(bone.rotation.z, initial.z, hSpeed);
      });
      rightIndexRef.current.forEach((bone, i) => {
        const initial = initialRightIndexRot.current[i];
        if (initial) bone.rotation.z = THREE.MathUtils.lerp(bone.rotation.z, initial.z, hSpeed);
      });
      rightMiddleRef.current.forEach((bone, i) => {
        const initial = initialRightMiddleRot.current[i];
        if (initial) bone.rotation.z = THREE.MathUtils.lerp(bone.rotation.z, initial.z, hSpeed);
      });
      rightRingRef.current.forEach((bone, i) => {
        const initial = initialRightRingRot.current[i];
        if (initial) bone.rotation.z = THREE.MathUtils.lerp(bone.rotation.z, initial.z, hSpeed);
      });
      rightPinkyRef.current.forEach((bone, i) => {
        const initial = initialRightPinkyRot.current[i];
        if (initial) bone.rotation.z = THREE.MathUtils.lerp(bone.rotation.z, initial.z, hSpeed);
      });

    } else {
      // ── DEFAULT NATURAL RESTING POSTURE ──────────────────────────────────────
      if (spineBoneRef.current) {
        spineBoneRef.current.rotation.y = THREE.MathUtils.lerp(
          spineBoneRef.current.rotation.y, 0, normFactor
        );
      }

      if (initialLeftArmRot.current && leftArmRef.current) {
        const base  = initialLeftArmRot.current;
        const swayX = Math.sin(t * 1.2) * 0.02;
        const swayZ = Math.cos(t * 1.5) * 0.02;
        leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, base.x + swayX, normFactor);
        leftArmRef.current.rotation.y = THREE.MathUtils.lerp(leftArmRef.current.rotation.y, base.y,         normFactor);
        leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, base.z + swayZ, normFactor);
      }
      if (leftForearmRef.current && initialLeftForearmRot.current) {
        const base = initialLeftForearmRot.current;
        leftForearmRef.current.rotation.x = THREE.MathUtils.lerp(leftForearmRef.current.rotation.x, base.x, normFactor);
        leftForearmRef.current.rotation.y = THREE.MathUtils.lerp(leftForearmRef.current.rotation.y, base.y, normFactor);
        leftForearmRef.current.rotation.z = THREE.MathUtils.lerp(leftForearmRef.current.rotation.z, base.z, normFactor);
      }
      if (leftHandRef.current && initialLeftHandRot.current) {
        const base     = initialLeftHandRot.current;
        const handSway = Math.sin(t * 2) * 0.03;
        leftHandRef.current.rotation.x = THREE.MathUtils.lerp(leftHandRef.current.rotation.x, base.x + handSway, normFactor);
        leftHandRef.current.rotation.y = THREE.MathUtils.lerp(leftHandRef.current.rotation.y, base.y,            normFactor);
        leftHandRef.current.rotation.z = THREE.MathUtils.lerp(leftHandRef.current.rotation.z, base.z,            normFactor);
      }
      if (rightArmRef.current && initialRightArmRot.current) {
        const base  = initialRightArmRot.current;
        const swayRX = Math.sin(t * 1.3) * 0.02;
        const swayRZ = Math.cos(t * 1.4) * 0.02;
        rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, base.x + swayRX, medFactor);
        rightArmRef.current.rotation.y = THREE.MathUtils.lerp(rightArmRef.current.rotation.y, base.y,          medFactor);
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, base.z + swayRZ, medFactor);
      }
      if (rightForearmRef.current && initialRightForearmRot.current) {
        const base = initialRightForearmRot.current;
        rightForearmRef.current.rotation.x = THREE.MathUtils.lerp(rightForearmRef.current.rotation.x, base.x, medFactor);
        rightForearmRef.current.rotation.y = THREE.MathUtils.lerp(rightForearmRef.current.rotation.y, base.y, medFactor);
        rightForearmRef.current.rotation.z = THREE.MathUtils.lerp(rightForearmRef.current.rotation.z, base.z, medFactor);
      }
    }

    // ── MODEL WORLD TRANSFORM ─────────────────────────────────────────────────
    if (modelRef.current) {
      // Read from zustand every tick — same no-stale-closure pattern as the
      // project-hover/cert-swipe state above.
      const isChatOpenNow = useNavStore.getState().isChatOpen;
      const activeSection = useNavStore.getState().activeSection;
      const sectionPose = SECTION_POSES[activeSection] ?? SECTION_POSES.hero;

      const baseScale = 3.4 * (1.0 - scrollProgress * 0.1);

      // During certifications: robot moves back toward the center and faces straight
      // 💡 HOW TO TWEAK POSITIONS:
      // - To move the robot further right, INCREASE the 1.5 below (e.g., 1.8).
      // - To move it further left, DECREASE the 1.5 below (e.g., 1.0 or 1.2).
      // Since sectionPose.x is -1.5 for certifications, adding exactly +1.5 makes the final X position 0 (dead center).
      const certXOffset = certProgress * 1.5;

      // - To make the robot float higher, INCREASE the 0.15 below.
      const certYOffset = certProgress * 0.15 + Math.sin(t * 1.8) * 0.01 * certProgress; // Slight float up

      // - To make the robot rotate, adjust the -0.55 below.
      // Right now it perfectly cancels sectionPose.rotY (0.55) so it faces straight.
      const certYRot    = -0.55 * certProgress;

      let targetXPos, targetYPos, targetZPos, targetYRot, targetScale;

      if (poseControls.forcePose) {
        // When forced, disable all scroll-based static animations.
        // The robot stays exactly where the joystick puts it (relative to baseline).
        targetXPos  = poseControls.bot_x;
        targetYPos  = -5.0 + poseControls.bot_y;
        targetZPos  = poseControls.bot_z;
        targetYRot  = poseControls.bot_rot_y;
        targetScale = 3.4;
      } else if (isChatOpenNow) {
        // AI chat open: deselect from whatever section pose was active (and
        // override a possibly-stale project hover — the project grid goes
        // pointer-events-none the instant chat opens, but hoveredProjectId
        // can only clear on a real mouseleave, which won't fire if the click
        // that opened chat didn't first leave the hovered card) and hold a
        // centered "listening" stance instead. Closing chat falls back to the
        // section branch below, which re-reads the (unchanged) active section
        // — so the robot returns to right where it was.
        targetXPos  = AI_CHAT_POSE.x + poseControls.bot_x;
        targetYPos  = -5.0 + AI_CHAT_POSE.y + poseControls.bot_y;
        targetZPos  = AI_CHAT_POSE.z + poseControls.bot_z;
        targetYRot  = AI_CHAT_POSE.rotY + poseControls.bot_rot_y;
        targetScale = 3.4;
      } else if (isProjectHover && activePose) {
        // Project hover: position the robot exactly at the pose's world coords
        targetXPos  = activePose.bot_x;
        targetYPos  = -5.0 + activePose.bot_y;
        targetZPos  = activePose.bot_z;
        targetYRot  = activePose.bot_rot_y;
        targetScale = 3.4;
      } else {
        // Static per-section pose (see SECTION_POSES) plus the cert-swipe
        // choreography, which is tuned to land centered from this same base.
        targetXPos  = sectionPose.x + certXOffset + poseControls.bot_x;
        targetYPos  = -5.0 + sectionPose.y + certYOffset + poseControls.bot_y;
        targetZPos  = sectionPose.z + poseControls.bot_z;
        targetYRot  = sectionPose.rotY + certYRot + poseControls.bot_rot_y;
        targetScale = activeSection === 'projects' || activeSection === 'skills' ? 3.4 : baseScale;
      }

      modelRef.current.position.x = THREE.MathUtils.lerp(modelRef.current.position.x, targetXPos,  medFactor);
      modelRef.current.position.y = THREE.MathUtils.lerp(modelRef.current.position.y, targetYPos,  medFactor);
      modelRef.current.position.z = THREE.MathUtils.lerp(modelRef.current.position.z, targetZPos,  medFactor);
      modelRef.current.rotation.y = THREE.MathUtils.lerp(modelRef.current.rotation.y, targetYRot,  medFactor);
      modelRef.current.scale.setScalar(THREE.MathUtils.lerp(modelRef.current.scale.x, targetScale, medFactor));
    }
  });

  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={3.4}
      position={[0, -5, 0]}
    />
  );
}

export default function HeroRobot() {
  return (
    <div className="w-full h-full pointer-events-auto">
      <Canvas
        frameloop="always"
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.3, 4.0], fov: 42 }}
        gl={{ alpha: true, antialias: true }}
        className="w-full h-full"
      >
          <ambientLight intensity={1.4} />
          <directionalLight position={[5, 8, 5]} intensity={2.8} color="#38bdf8" />
          <directionalLight position={[-5, 5, -3]} intensity={1.8} color="#c084fc" />
          <pointLight position={[0, 2, 3]} intensity={2.2} color="#ffffff" />

          <React.Suspense fallback={null}>
            <RobotModel />
            <Environment preset="city" />
          </React.Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/robot_character.glb");
