import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import Robot from './Robot3D';

export default function Robot3DCanvas({ lookTarget }) {
  return (
    <Canvas camera={{ position: [0, 0, 5.5], fov: 40 }} dpr={[1, 1.5]}>
      <ambientLight intensity={0.15} />
      <spotLight position={[5, 8, 8]} angle={0.3} penumbra={0.8} intensity={1.2} />
      <pointLight position={[-4, 3, 2]} intensity={0.2} color="#c4b5fd" />
      <group scale={0.85}>
        <Robot lookTarget={lookTarget} />
      </group>
      <Environment preset="studio" environmentIntensity={0.3} />
      <ContactShadows position={[0, -1.6, 0]} opacity={0.6} scale={8} blur={2.5} />
    </Canvas>
  );
}
