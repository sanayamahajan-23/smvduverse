import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Sphere, Text } from '@react-three/drei'; 
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom'; 
const RotatingGlobe = () => {
  const globeRef = useRef();
  const pinRef = useRef();
  const pulseRef = useRef(); 
  const textRef = useRef();  
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false); 
  const navigate = useNavigate();
  const INDIA_LAT = 110.59; 
  const INDIA_LNG = 190.77; 
  const SMVDU_LAT = 144.70;
  const SMVDU_LNG = 253.77;
  
  useEffect(() => {
    setIsLoaded(true);
    const delay = setTimeout(() => {
      setIsAnimating(true);
    }, 1000);

    return () => clearTimeout(delay);
  }, []);
  const targetQuaternion = new THREE.Quaternion();
  const latRad = THREE.MathUtils.degToRad(90 - INDIA_LAT);
  const lngRad = THREE.MathUtils.degToRad(INDIA_LNG);

  const euler = new THREE.Euler(latRad, lngRad, 0, 'YXZ');
  targetQuaternion.setFromEuler(euler);
  const calculatePositionFromLatLng = (lat, lng, radius) => {
    const phi = THREE.MathUtils.degToRad(90 - lat); 
    const theta = THREE.MathUtils.degToRad(lng + 180);

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);

    return [x, y, z];
  };

  const pinPosition = calculatePositionFromLatLng(SMVDU_LAT, SMVDU_LNG, 3.35); 

  useFrame(({ camera }) => {
    if (globeRef.current && isLoaded && isAnimating) {
      const globe = globeRef.current;
      const currentQuaternion = globe.quaternion;
      currentQuaternion.slerp(targetQuaternion, 0.05);

      if (currentQuaternion.angleTo(targetQuaternion) < 0.01) {
        globe.quaternion.copy(targetQuaternion);
        setIsAnimating(false);
      }
    }
    if (pulseRef.current) {
      const pulseScale = 1 + Math.sin(Date.now() * 0.003) * 0.3; 
      pulseRef.current.scale.set(pulseScale, pulseScale, pulseScale);
      pulseRef.current.material.opacity = 0.2 + Math.sin(Date.now() * 0.003) * 0.1; 
    }
    if (textRef.current) {
      textRef.current.lookAt(camera.position);
    }
  });
  const handlePinClick = () => {
     navigate('/smvdu-map');
  };
  return (
    <>
      <Sphere ref={globeRef} args={[3.3, 64, 64]}>
  <meshStandardMaterial map={new THREE.TextureLoader().load('/assets/earth.jpg')} />
  <mesh
    ref={pinRef}
    position={pinPosition.map(coord => coord * (3.35 / 3.3))} 
    onPointerOver={() => setIsHovered(true)}
    onPointerOut={() => setIsHovered(false)}
    onClick={handlePinClick}
  >
    <sphereGeometry args={[0.03, 36, 36]} /> 
    <meshStandardMaterial 
      color="#CC0000"  
      emissive="#CC0000" 
      emissiveIntensity={0.5} 
    />
  </mesh>
  <mesh ref={pulseRef} position={pinPosition.map(coord => coord * (3.35 / 3.3))}>
    <sphereGeometry args={[0.05, 32, 32]} /> 
    <meshStandardMaterial 
      color="#CC0000" 
      transparent 
      opacity={0.2}  
    />
  </mesh>
  {isHovered && (
    <Text
      ref={textRef}
      position={[
        pinPosition[0] * (3.35 / 3.3),
        pinPosition[1] * (3.35 / 3.3) + 0.1,
        pinPosition[2] * (3.35 / 3.3)
      ]} 
      color="white"
      fontSize={0.1} 
      anchorX="center"
      anchorY="middle"
    >
      SMVDU
    </Text>
  )}
</Sphere>
    </>
  );
};
const Globe = () => {
  return (
    <Canvas style={{ height: '100vh', background: 'black' }}>
      <ambientLight intensity={1} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <Stars radius={200} depth={100} count={20000} factor={4} saturation={2} fade />
      <RotatingGlobe />
    </Canvas>
  );
};

export default Globe;
