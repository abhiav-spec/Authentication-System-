import { useEffect, useRef } from 'react';
import * as THREE from 'three';

function AnimatedBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 22;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    const particleCount = 1200;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 80;
      positions[i + 1] = (Math.random() - 0.5) * 80;
      positions[i + 2] = (Math.random() - 0.5) * 80;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      color: 0x88ccff,
      size: 0.09,
      transparent: true,
      opacity: 0.7,
    });

    const particleCloud = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleCloud);

    const sphereGeometry = new THREE.IcosahedronGeometry(2.2, 1);
    const sphereMaterial = new THREE.MeshStandardMaterial({
      color: 0x2c8bff,
      roughness: 0.25,
      metalness: 0.7,
      transparent: true,
      opacity: 0.35,
      emissive: 0x0f3b78,
      emissiveIntensity: 0.55,
    });

    const orb = new THREE.Mesh(sphereGeometry, sphereMaterial);
    orb.position.set(-5, 1.8, -6);
    scene.add(orb);

    const orb2 = new THREE.Mesh(sphereGeometry, sphereMaterial.clone());
    orb2.material.color = new THREE.Color(0x00d4b0);
    orb2.material.emissive = new THREE.Color(0x0c6f60);
    orb2.position.set(6, -2.1, -8);
    orb2.scale.setScalar(0.8);
    scene.add(orb2);

    const ambient = new THREE.AmbientLight(0xbad5ff, 0.85);
    scene.add(ambient);

    const directional = new THREE.DirectionalLight(0x88c5ff, 1.4);
    directional.position.set(8, 10, 10);
    scene.add(directional);

    const timer = new THREE.Timer();
    timer.connect(document);
    let animationFrame;

    const animate = () => {
      timer.update();
      const elapsed = timer.getElapsed();

      particleCloud.rotation.y = elapsed * 0.03;
      particleCloud.rotation.x = Math.sin(elapsed * 0.25) * 0.04;

      orb.rotation.y += 0.004;
      orb.rotation.x = Math.sin(elapsed * 0.7) * 0.25;
      orb.position.y = 1.8 + Math.sin(elapsed * 0.9) * 0.45;

      orb2.rotation.y -= 0.005;
      orb2.rotation.z = Math.cos(elapsed * 0.65) * 0.3;
      orb2.position.y = -2.1 + Math.cos(elapsed * 0.8) * 0.5;

      renderer.render(scene, camera);
      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrame);
      timer.dispose();
      renderer.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="pointer-events-none fixed inset-0 -z-10" />;
}

export default AnimatedBackground;
