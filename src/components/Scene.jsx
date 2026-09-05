/* components/Scene.jsx: application source file. See README.md for the folder responsibility. */
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function DemoObject() {
  return (
    <mesh>
      <sphereGeometry args={[1.5, 64, 64]} />
      <meshStandardMaterial metalness={0.7} roughness={0.25} />
    </mesh>
  );
}

export default function Scene() {
  return (
    <div className="h-[500px] w-full">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={1} />
        <directionalLight position={[3, 3, 3]} intensity={2} />
        <DemoObject />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}