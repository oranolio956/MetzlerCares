<script lang="ts">
  import { onMount } from 'svelte';
  import * as THREE from 'three';

  let canvas: HTMLCanvasElement;
  let renderer: THREE.WebGLRenderer;
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let animationId: number;

  onMount(() => {
    if (!canvas) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Scene Setup
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x2d4f1e, 0.002); // Fog match Deep Moss

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particles (Spores/Fireflies)
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 500; // Reduced count for subtlety
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 15; // Spread
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Material
    const material = new THREE.PointsMaterial({
      size: 0.02, // Smaller particles
      color: 0xe07a5f, // Clay/Terra Cotta
      transparent: true,
      opacity: 0.6, // More transparent
    });

    // Mesh
    const particlesMesh = new THREE.Points(particlesGeometry, material);
    scene.add(particlesMesh);

    // Interaction
    let mouseX = 0;
    let mouseY = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const time = Date.now() * 0.0005;

      particlesMesh.rotation.y = time * 0.05; // Slower rotation
      particlesMesh.rotation.x = mouseY * 0.2; // Reduced mouse influence
      particlesMesh.rotation.y += mouseX * 0.2;

      // Gentle wave motion
      particlesMesh.position.y = Math.sin(time * 0.5) * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = event.clientX / window.innerWidth - 0.5;
      mouseY = event.clientY / window.innerHeight - 0.5;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
      renderer.dispose();
    };
  });
</script>

<canvas bind:this={canvas} class="fixed inset-0 -z-10 w-full h-full pointer-events-none opacity-40" />
