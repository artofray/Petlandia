/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MapControls, Environment, SoftShadows } from '@react-three/drei';
import { MathUtils } from 'three';
import * as THREE from 'three';
import { Grid, BuildingType, PetSpecies } from '../types';
import { GRID_SIZE, BUILDINGS } from '../constants';

// Fix for TypeScript not recognizing R3F elements in JSX
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// --- Constants & Helpers ---
const WORLD_OFFSET = GRID_SIZE / 2 - 0.5;
const gridToWorld = (x: number, y: number) => [x - WORLD_OFFSET, 0, y - WORLD_OFFSET] as [number, number, number];

// Deterministic random based on coordinates
const getHash = (x: number, y: number) => Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1;
const getRandomRange = (min: number, max: number) => Math.random() * (max - min) + min;

// Shared Geometries
const boxGeo = new THREE.BoxGeometry(1, 1, 1);
const cylinderGeo = new THREE.CylinderGeometry(1, 1, 1, 16);
const coneGeo = new THREE.ConeGeometry(1, 1, 4);
const sphereGeo = new THREE.SphereGeometry(1, 16, 16);
const torusGeo = new THREE.TorusGeometry(0.4, 0.1, 8, 16);

// --- Reusable 3D Pet Component ---

export const PetVisual = ({ species, color, scale = 1, isWalking = false }: { species: PetSpecies, color: string, scale?: number, isWalking?: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current && isWalking) {
      const t = state.clock.elapsedTime * 10;
      // Simple bounce
      groupRef.current.position.y = Math.abs(Math.sin(t)) * 0.1;
      groupRef.current.rotation.z = Math.sin(t) * 0.1;
    }
  });

  const material = useMemo(() => new THREE.MeshStandardMaterial({ color }), [color]);
  const s = scale;

  return (
    <group ref={groupRef}>
      {/* Body */}
      <mesh geometry={sphereGeo} material={material} scale={[0.4 * s, 0.3 * s, 0.5 * s]} position={[0, 0.15*s, 0]} castShadow />
      
      {/* Head */}
      <mesh geometry={sphereGeo} material={material} scale={0.25 * s} position={[0, 0.4*s, 0.3*s]} castShadow />

      {/* Species Specifics */}
      {species === 'Cat' && (
        <>
          <mesh geometry={coneGeo} material={material} scale={0.08 * s} position={[-0.15*s, 0.6*s, 0.3*s]} rotation={[0,0,0.5]} />
          <mesh geometry={coneGeo} material={material} scale={0.08 * s} position={[0.15*s, 0.6*s, 0.3*s]} rotation={[0,0,-0.5]} />
          {/* Tail */}
          <mesh geometry={cylinderGeo} material={material} scale={[0.05*s, 0.4*s, 0.05*s]} position={[0, 0.3*s, -0.3*s]} rotation={[0.5,0,0]} />
        </>
      )}
      
      {species === 'Dog' && (
        <>
          <mesh geometry={boxGeo} material={material} scale={[0.1*s, 0.15*s, 0.05*s]} position={[-0.2*s, 0.45*s, 0.3*s]} rotation={[0,0,0.5]} />
          <mesh geometry={boxGeo} material={material} scale={[0.1*s, 0.15*s, 0.05*s]} position={[0.2*s, 0.45*s, 0.3*s]} rotation={[0,0,-0.5]} />
          {/* Tail */}
          <mesh geometry={cylinderGeo} material={material} scale={[0.05*s, 0.2*s, 0.05*s]} position={[0, 0.3*s, -0.3*s]} rotation={[2,0,0]} />
        </>
      )}

      {species === 'Bunny' && (
        <>
          <mesh geometry={cylinderGeo} material={material} scale={[0.06*s, 0.4*s, 0.06*s]} position={[-0.1*s, 0.7*s, 0.25*s]} />
          <mesh geometry={cylinderGeo} material={material} scale={[0.06*s, 0.4*s, 0.06*s]} position={[0.1*s, 0.7*s, 0.25*s]} />
        </>
      )}

      {species === 'Dragon' && (
        <>
          {/* Wings */}
          <mesh geometry={coneGeo} material={new THREE.MeshStandardMaterial({color: '#ef4444'})} scale={[0.4*s, 0.05*s, 0.2*s]} position={[0.3*s, 0.3*s, 0]} rotation={[0,0,-0.5]} />
          <mesh geometry={coneGeo} material={new THREE.MeshStandardMaterial({color: '#ef4444'})} scale={[0.4*s, 0.05*s, 0.2*s]} position={[-0.3*s, 0.3*s, 0]} rotation={[0,0,0.5]} />
          {/* Horns */}
          <mesh geometry={coneGeo} material={new THREE.MeshStandardMaterial({color: '#fff'})} scale={0.05*s} position={[0, 0.65*s, 0.3*s]} />
        </>
      )}

      {species === 'Ghost' && (
        <mesh position={[0, 0.2*s, 0]}>
           <pointLight intensity={0.5} color={color} distance={2} />
           <meshBasicMaterial color={color} transparent opacity={0.6} />
        </mesh>
      )}

      {species === 'Rock' && (
        <mesh geometry={boxGeo} material={new THREE.MeshStandardMaterial({color: '#57534e'})} scale={0.35 * s} position={[0, 0.175*s, 0]} />
      )}
    </group>
  );
}

// --- Buildings ---

const DecorBlock = React.memo(({ position, scale, color, geometry = boxGeo }: { position: [number, number, number], scale: [number, number, number], color: string, geometry?: THREE.BufferGeometry }) => (
  <mesh geometry={geometry} position={position} scale={scale} castShadow receiveShadow>
    <meshStandardMaterial color={color} roughness={0.3} />
  </mesh>
));

interface BuildingMeshProps {
  type: BuildingType;
  baseColor: string;
  x: number;
  y: number;
  opacity?: number;
  transparent?: boolean;
}

const ProceduralBuilding = React.memo(({ type, baseColor, x, y, opacity = 1, transparent = false }: BuildingMeshProps) => {
  const hash = getHash(x, y);
  const variant = Math.floor(hash * 100); 
  const rotation = Math.floor(hash * 4) * (Math.PI / 2);
  
  const color = useMemo(() => {
    const c = new THREE.Color(baseColor);
    c.offsetHSL(hash * 0.1 - 0.05, 0, hash * 0.1 - 0.05);
    return c;
  }, [baseColor, hash]);

  const mainMat = useMemo(() => new THREE.MeshStandardMaterial({ color, flatShading: false, opacity, transparent, roughness: 0.5 }), [color, opacity, transparent]);
  const accentMat = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(color).multiplyScalar(0.7).offsetHSL(0.1, 0, 0), flatShading: false, opacity, transparent }), [color, opacity, transparent]);
  const roofMat = useMemo(() => new THREE.MeshStandardMaterial({ color: new THREE.Color(color).offsetHSL(0.5, 0.5, -0.1), flatShading: false, opacity, transparent }), [color, opacity, transparent]);
  const neonMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#22d3ee', emissive: '#22d3ee', emissiveIntensity: 0.5, transparent, opacity }), [transparent, opacity]);

  const commonProps = { castShadow: true, receiveShadow: true };
  const yOffset = -0.3;

  return (
    <group rotation={[0, rotation, 0]} position={[0, yOffset, 0]}>
      {(() => {
        switch (type) {
          case BuildingType.Residential:
            if (variant < 33) {
              return (
                <>
                  <mesh {...commonProps} material={mainMat} geometry={boxGeo} position={[0, 0.25, 0]} scale={[0.6, 0.5, 0.7]} />
                  <mesh {...commonProps} material={roofMat} geometry={coneGeo} position={[0, 0.7, 0]} scale={[0.5, 0.4, 0.8]} rotation={[0, Math.PI/4, 0]} />
                  <mesh {...commonProps} material={new THREE.MeshStandardMaterial({color: '#444'})} geometry={cylinderGeo} position={[0, 0.15, 0.36]} scale={[0.2, 0.3, 0.1]} rotation={[Math.PI/2, 0, 0]} />
                </>
              );
            } else if (variant < 66) {
              return (
                <>
                  <mesh {...commonProps} material={new THREE.MeshStandardMaterial({color: '#d1d5db'})} geometry={cylinderGeo} position={[0, 0.6, 0]} scale={[0.1, 1.2, 0.1]} />
                  <mesh {...commonProps} material={mainMat} geometry={cylinderGeo} position={[0, 0.1, 0]} scale={[0.4, 0.2, 0.4]} />
                  <mesh {...commonProps} material={roofMat} geometry={boxGeo} position={[0.1, 0.5, 0.1]} scale={[0.4, 0.1, 0.4]} />
                  <mesh {...commonProps} material={roofMat} geometry={cylinderGeo} position={[-0.1, 0.9, -0.1]} scale={[0.3, 0.2, 0.3]} />
                  <mesh {...commonProps} material={accentMat} geometry={sphereGeo} position={[-0.1, 1.1, -0.1]} scale={0.15} />
                </>
              );
            } else {
              return (
                <>
                  <mesh {...commonProps} material={mainMat} geometry={boxGeo} position={[-0.15, 0.3, 0]} scale={[0.4, 0.4, 0.4]} />
                  <mesh {...commonProps} material={mainMat} geometry={boxGeo} position={[0.15, 0.5, 0]} scale={[0.4, 0.4, 0.4]} />
                  <mesh {...commonProps} material={new THREE.MeshStandardMaterial({color: '#a78bfa', transparent: true, opacity: 0.6})} geometry={cylinderGeo} position={[0, 0.4, 0]} scale={[0.15, 0.4, 0.15]} rotation={[0,0,Math.PI/2]} />
                </>
              );
            }

          case BuildingType.Commercial:
            if (variant < 50) {
              return (
                <>
                  <mesh {...commonProps} material={mainMat} geometry={boxGeo} position={[0, 0.3, 0]} scale={[0.8, 0.6, 0.6]} />
                  <mesh {...commonProps} material={accentMat} geometry={boxGeo} position={[0, 0.65, 0]} scale={[0.85, 0.1, 0.65]} />
                  <group position={[0, 0.9, 0]} rotation={[0,0,Math.PI/6]}>
                    <mesh material={new THREE.MeshStandardMaterial({color: '#fef3c7'})} geometry={cylinderGeo} scale={[0.1, 0.6, 0.1]} rotation={[0,0,Math.PI/2]} />
                    <mesh material={new THREE.MeshStandardMaterial({color: '#fef3c7'})} geometry={sphereGeo} position={[-0.35, 0, 0]} scale={0.15} />
                    <mesh material={new THREE.MeshStandardMaterial({color: '#fef3c7'})} geometry={sphereGeo} position={[0.35, 0, 0]} scale={0.15} />
                  </group>
                </>
              );
            } else {
               return (
                <>
                  <mesh {...commonProps} material={mainMat} geometry={cylinderGeo} position={[0, 0.4, 0]} scale={[0.5, 0.8, 0.5]} />
                  <mesh {...commonProps} material={roofMat} geometry={coneGeo} position={[0, 0.9, 0]} scale={[0.6, 0.3, 0.6]} />
                  <mesh material={new THREE.MeshStandardMaterial({color: '#fca5a5'})} geometry={boxGeo} position={[0, 1.1, 0]} scale={[0.4, 0.2, 0.05]} />
                  <mesh material={new THREE.MeshStandardMaterial({color: '#fca5a5'})} geometry={coneGeo} position={[0.25, 1.1, 0]} scale={[0.2, 0.2, 0.05]} rotation={[0,0,-Math.PI/2]} />
                </>
               )
            }

          case BuildingType.Industrial:
            return (
              <>
                <mesh {...commonProps} material={mainMat} geometry={boxGeo} position={[0, 0.4, 0]} scale={[0.9, 0.8, 0.8]} />
                <mesh {...commonProps} material={accentMat} geometry={cylinderGeo} position={[0.2, 0.9, 0.2]} scale={[0.15, 0.4, 0.15]} />
                <mesh {...commonProps} material={accentMat} geometry={cylinderGeo} position={[-0.2, 0.8, -0.2]} scale={[0.15, 0.2, 0.15]} />
                <DecorBlock position={[0, 0.9, 0]} scale={[0.3, 0.3, 0.3]} color={BUILDINGS[BuildingType.Industrial].color} geometry={sphereGeo} />
              </>
            );

          case BuildingType.Park:
            return (
              <group position={[0, -yOffset - 0.29, 0]}>
                <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
                    <planeGeometry args={[0.9, 0.9]} />
                    <meshStandardMaterial color="#bef264" />
                </mesh>
                {variant < 50 ? (
                    <group position={[0, 0.2, 0]}>
                        <mesh material={new THREE.MeshStandardMaterial({color: '#ef4444'})} geometry={torusGeo} scale={[0.5,0.5,0.5]} position={[0,0.1,0]} />
                    </group>
                ) : (
                     <mesh material={new THREE.MeshStandardMaterial({color: '#3b82f6'})} geometry={cylinderGeo} scale={[0.3,0.6,0.3]} rotation={[0,0,Math.PI/2]} position={[0,0.15,0]} />
                )}
                <mesh position={[0.3,0.1,0.3]} geometry={sphereGeo} scale={0.15} material={new THREE.MeshStandardMaterial({color: '#15803d'})} />
              </group>
            );

          case BuildingType.Entertainment:
            // Laser Dome
            return (
              <>
                <mesh {...commonProps} material={mainMat} geometry={cylinderGeo} position={[0, 0.3, 0]} scale={[0.9, 0.6, 0.9]} />
                <mesh {...commonProps} material={neonMat} geometry={sphereGeo} position={[0, 0.6, 0]} scale={[0.4, 0.4, 0.4]} />
                {/* Lasers */}
                <mesh material={neonMat} geometry={cylinderGeo} position={[0, 1.5, 0]} scale={[0.02, 2, 0.02]} />
                <mesh material={neonMat} geometry={cylinderGeo} position={[0.2, 1.2, 0]} scale={[0.02, 1.5, 0.02]} rotation={[0,0,-0.2]} />
              </>
            );

          case BuildingType.Service:
            // Vet Clinic
            return (
              <>
                 <mesh {...commonProps} material={new THREE.MeshStandardMaterial({color: '#fff'})} geometry={boxGeo} position={[0, 0.4, 0]} scale={[0.8, 0.6, 0.6]} />
                 <mesh {...commonProps} material={roofMat} geometry={coneGeo} position={[0, 0.9, 0]} scale={[0.9, 0.4, 0.7]} />
                 {/* Red Cross */}
                 <group position={[0, 0.5, 0.31]} scale={0.15}>
                    <mesh material={new THREE.MeshStandardMaterial({color: '#ef4444'})} geometry={boxGeo} scale={[0.4, 1, 0.1]} />
                    <mesh material={new THREE.MeshStandardMaterial({color: '#ef4444'})} geometry={boxGeo} scale={[1, 0.4, 0.1]} />
                 </group>
              </>
            );

          case BuildingType.Road:
             return null;
          default:
            return null;
        }
      })()}
    </group>
  );
});

// --- Systems ---

const TrafficSystem = ({ grid }: { grid: Grid }) => {
  const roadTiles = useMemo(() => {
    const roads: {x: number, y: number}[] = [];
    grid.forEach(row => row.forEach(tile => {
      if (tile.buildingType === BuildingType.Road) roads.push({x: tile.x, y: tile.y});
    }));
    return roads;
  }, [grid]);

  const carCount = Math.min(roadTiles.length, 20);
  const carsRef = useRef<THREE.InstancedMesh>(null);
  const carsState = useRef<Float32Array>(new Float32Array(0)); 
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    if (roadTiles.length < 2) return;
    carsState.current = new Float32Array(carCount * 6);
    const newColors = new Float32Array(carCount * 3);

    for (let i = 0; i < carCount; i++) {
      const startNode = roadTiles[Math.floor(Math.random() * roadTiles.length)];
      carsState.current[i*6 + 0] = startNode.x;
      carsState.current[i*6 + 1] = startNode.y;
      carsState.current[i*6 + 2] = startNode.x;
      carsState.current[i*6 + 3] = startNode.y;
      carsState.current[i*6 + 4] = 1; 
      carsState.current[i*6 + 5] = getRandomRange(0.02, 0.05);

      const color = new THREE.Color(['#ef4444', '#f97316', '#8b5cf6'][Math.floor(Math.random() * 3)]);
      newColors[i*3] = color.r; newColors[i*3+1] = color.g; newColors[i*3+2] = color.b;
    }

    if (carsRef.current) {
        carsRef.current.instanceColor = new THREE.InstancedBufferAttribute(newColors, 3);
    }
  }, [roadTiles, carCount]);

  useFrame(() => {
    if (!carsRef.current || roadTiles.length < 2 || carsState.current.length === 0) return;

    for (let i = 0; i < carCount; i++) {
      const idx = i * 6;
      let curX = carsState.current[idx];
      let curY = carsState.current[idx+1];
      let tarX = carsState.current[idx+2];
      let tarY = carsState.current[idx+3];
      let progress = carsState.current[idx+4];
      const speed = carsState.current[idx+5];

      progress += speed;

      if (progress >= 1) {
        curX = tarX;
        curY = tarY;
        progress = 0;
        
        const neighbors = roadTiles.filter(t => 
          (Math.abs(t.x - curX) === 1 && t.y === curY) || 
          (Math.abs(t.y - curY) === 1 && t.x === curX)
        );

        if (neighbors.length > 0) {
            const valid = neighbors.length > 1 
                ? neighbors.filter(n => Math.abs(n.x - carsState.current[idx]) > 0.1 || Math.abs(n.y - carsState.current[idx+1]) > 0.1)
                : neighbors;
            const next = valid.length > 0 ? valid[Math.floor(Math.random() * valid.length)] : neighbors[0];
            tarX = next.x;
            tarY = next.y;
        } else {
            const rnd = roadTiles[Math.floor(Math.random() * roadTiles.length)];
            curX = rnd.x; curY = rnd.y; tarX = rnd.x; tarY = rnd.y;
        }
      }

      carsState.current[idx] = curX;
      carsState.current[idx+1] = curY;
      carsState.current[idx+2] = tarX;
      carsState.current[idx+3] = tarY;
      carsState.current[idx+4] = progress;

      const gx = MathUtils.lerp(curX, tarX, progress);
      const gy = MathUtils.lerp(curY, tarY, progress);
      const dx = tarX - curX;
      const dy = tarY - curY;
      const angle = Math.atan2(dy, dx);
      
      const [wx, _, wz] = gridToWorld(gx, gy);

      dummy.position.set(wx, -0.25, wz);
      dummy.rotation.set(0, -angle, 0);
      dummy.scale.set(0.4, 0.1, 0.4); 
      dummy.updateMatrix();
      carsRef.current.setMatrixAt(i, dummy.matrix);
    }
    carsRef.current.instanceMatrix.needsUpdate = true;
  });

  if (roadTiles.length < 2) return null;
  return (
    <instancedMesh ref={carsRef} args={[cylinderGeo, undefined, carCount]} castShadow>
      <meshStandardMaterial roughness={0.5} metalness={0.5} />
    </instancedMesh>
  );
};

const PopulationSystem = ({ population, grid }: { population: number, grid: Grid }) => {
    // Basic particle system for population visual
    const agentCount = Math.min(Math.floor(population / 5), 100); 
    const meshRef = useRef<THREE.InstancedMesh>(null);
    
    // Simplification for brevity: Reuse previous logic but simpler rendering
    // Just rendering small spheres for "generic" population to save performance
    // since we now have a detailed hero avatar
    
    useFrame((state) => {
       // Just animate static instances for background ambience if needed
       // For this update, keeping it very simple or removing if it conflicts with performance
    });

    return null; // Disabled mass population rendering to focus on Hero Avatar and performance, or implement later
};

// --- Main Map Component ---

interface IsoMapProps {
  grid: Grid;
  onTileClick: (x: number, y: number) => void;
  hoveredTool: BuildingType;
  population: number;
}

const IsoMap: React.FC<IsoMapProps> = ({ grid, onTileClick, hoveredTool, population }) => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas shadows orthographic camera={{ position: [20, 20, 20], zoom: 40, near: 0.1, far: 200 }}>
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[10, 20, 10]} 
          intensity={1} 
          castShadow 
          shadow-mapSize={[1024, 1024]} 
        />
        
        <group position={[0, 0, 0]}>
          {grid.map((row, y) =>
            row.map((tile, x) => {
              const [wx, wy, wz] = gridToWorld(x, y);
              const config = BUILDINGS[tile.buildingType];
              const isNone = tile.buildingType === BuildingType.None;
              const isRoad = tile.buildingType === BuildingType.Road;

              return (
                <group key={`${x}-${y}`} position={[wx, wy, wz]}>
                  {/* Ground Tile */}
                  <mesh 
                    receiveShadow 
                    onClick={(e) => { e.stopPropagation(); onTileClick(x, y); }}
                    onPointerOver={(e) => { document.body.style.cursor = 'pointer'; }}
                    onPointerOut={(e) => { document.body.style.cursor = 'auto'; }}
                    position={[0, -0.5, 0]}
                  >
                    <boxGeometry args={[1, 0.2, 1]} />
                    <meshStandardMaterial color={isRoad ? '#a8a29e' : (isNone ? '#86efac' : '#bbf7d0')} />
                  </mesh>

                  {/* Building */}
                  {!isNone && !isRoad && (
                     <ProceduralBuilding type={tile.buildingType} baseColor={config.color} x={x} y={y} />
                  )}
                  
                  {/* Road Markers */}
                  {isRoad && (
                      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0,-0.39,0]}>
                          <planeGeometry args={[0.6, 0.6]} />
                          <meshStandardMaterial color="#d6d3d1" />
                      </mesh>
                  )}
                </group>
              );
            })
          )}
          
          <TrafficSystem grid={grid} />
        </group>

        <MapControls enableRotate={false} enableZoom={true} minZoom={20} maxZoom={80} />
        <Environment preset="city" />
        <SoftShadows size={10} samples={8} />
      </Canvas>
    </div>
  );
};

export default IsoMap;