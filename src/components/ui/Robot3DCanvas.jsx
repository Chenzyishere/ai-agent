import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import Robot from './Robot3D';

export default function Robot3DCanvas({ lookTarget }) {
  return (
    <Canvas camera={{ position: [0, 0, 5.5], fov: 40 }} dpr={[1, 1.5]}>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} />
      <pointLight position={[-5, 5, 3]} intensity={0.6} color="#c4b5fd" />
      <group scale={0.85}>
        <Robot lookTarget={lookTarget} />
      </group>
      <Environment preset="city" />
      <ContactShadows position={[0, -1.6, 0]} opacity={0.4} scale={8} blur={2} />
    </Canvas>
  );
}
