import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useFBX, useTexture } from '@react-three/drei';
import * as THREE from 'three';

export default function Robot({ lookTarget }) {
  const groupRef = useRef();
  const fbx = useFBX('/robot/robot.fbx');
  const textures = useTexture({
    map: '/robot/robot.png',
    aoMap: '/robot/robot_ao.png',
    roughnessMap: '/robot/robot_r.png',
    metalnessMap: '/robot/robot_m.png',
    normalMap: '/robot/robot_nm.png',
  });

  useEffect(() => {
    fbx.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          map: textures.map,
          aoMap: textures.aoMap,
          roughnessMap: textures.roughnessMap,
          metalnessMap: textures.metalnessMap,
          normalMap: textures.normalMap,
          roughness: 0.6,
          metalness: 0.3,
        });
      }
    });
  }, [fbx, textures]);

  useFrame(() => {
    if (!groupRef.current) return;
    const targetY = lookTarget.x * 0.6;
    const targetX = -lookTarget.y * 0.35;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y, targetY, 0.06,
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x, targetX, 0.06,
    );
  });

  return (
    <group ref={groupRef}>
      <primitive object={fbx} scale={0.018} position={[0, 0, 0]} />
    </group>
  );
}
