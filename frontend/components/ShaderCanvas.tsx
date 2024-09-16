"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface ImageContainerProps {
    imageUrl: string;
  }

const ImageContainer : React.FC<ImageContainerProps> = ({ imageUrl })=> {
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const easeFactor = 0.02;
  let scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer,
    planeMesh: THREE.Mesh;
  let mousePosition = { x: 0.5, y: 0.5 };
  let targetMousePosition = { x: 0.5, y: 0.5 };
  let aberrationIntensity = 0.0;
  let prevPosition = { x: 0.5, y: 0.5 };

  useEffect(() => {
    if (!imageContainerRef.current) return;

    // Initialize the renderer and ensure no previous canvas is appended
    if (renderer) {
      renderer.dispose(); // Clean up any existing renderer
      if (imageContainerRef.current) {
        // Remove any existing canvas element
        while (imageContainerRef.current.firstChild) {
          imageContainerRef.current.removeChild(imageContainerRef.current.firstChild);
        }
      }
    }

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(imageContainerRef.current.offsetWidth, imageContainerRef.current.offsetHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Append the new renderer canvas to the container
    imageContainerRef.current.appendChild(renderer.domElement);

    // Load the image as texture
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(
        imageUrl,
      () => {
        renderer.setSize(imageContainerRef.current!.offsetWidth, imageContainerRef.current!.offsetHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
      }
    );

    // Initialize the scene
    scene = new THREE.Scene();

    // Camera setup
    camera = new THREE.PerspectiveCamera(
      80,
      imageContainerRef.current.offsetWidth / imageContainerRef.current.offsetHeight,
      0.01,
      10
    );
    camera.position.z = 1;

    // Shader uniforms and shaders
    const shaderUniforms = {
      u_mouse: { value: new THREE.Vector2() },
      u_prevMouse: { value: new THREE.Vector2() },
      u_aberrationIntensity: { value: 0.0 },
      u_texture: { value: texture },
    };

    const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`;

    const fragmentShader = `
varying vec2 vUv;
uniform sampler2D u_texture;    
uniform vec2 u_mouse;
uniform vec2 u_prevMouse;
uniform float u_aberrationIntensity;

void main() {
    vec2 gridUV = floor(vUv * vec2(20.0, 20.0)) / vec2(20.0, 20.0);
    vec2 centerOfPixel = gridUV + vec2(1.0 / 20.0, 1.0 / 20.0);

    vec2 mouseDirection = u_mouse - u_prevMouse;
    vec2 pixelToMouseDirection = centerOfPixel - u_mouse;
    float pixelDistanceToMouse = length(pixelToMouseDirection);
    float strength = smoothstep(0.3, 0.0, pixelDistanceToMouse);

    vec2 uvOffset = strength * -mouseDirection * 0.2;
    vec2 uv = vUv - uvOffset;

    vec4 color = texture2D(u_texture, uv);
    float gray = dot(color.rgb, vec3(0.3, 0.59, 0.11)); // Convert to grayscale
    vec4 grayColor = vec4(gray, gray, gray, 1.0);

    // Apply color only if aberration intensity is greater than 0
    gl_FragColor = mix(grayColor, color, u_aberrationIntensity);
}
`;


    // Create a plane mesh with the shader material
    planeMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({
        uniforms: shaderUniforms,
        vertexShader,
        fragmentShader,
      })
    );
    scene.add(planeMesh);

    // Handle window resize
    const handleResize = () => {
      if (imageContainerRef.current) {
        const width = imageContainerRef.current.offsetWidth;
        const height = imageContainerRef.current.offsetHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    };

    window.addEventListener("resize", handleResize);

    // Animation loop
    const animateScene = () => {
      requestAnimationFrame(animateScene);
      mousePosition.x += (targetMousePosition.x - mousePosition.x) * easeFactor;
      mousePosition.y += (targetMousePosition.y - mousePosition.y) * easeFactor;

      (planeMesh.material as THREE.ShaderMaterial).uniforms.u_mouse.value.set(
        mousePosition.x,
        1.0 - mousePosition.y
      );

      (planeMesh.material as THREE.ShaderMaterial).uniforms.u_prevMouse.value.set(
        prevPosition.x,
        1.0 - prevPosition.y
      );

      (planeMesh.material as THREE.ShaderMaterial).uniforms.u_aberrationIntensity.value =
        aberrationIntensity;

      renderer.render(scene, camera);
    };
    animateScene();

    // Mouse event handlers
    const handleMouseMove = (event: MouseEvent) => {
      if (imageContainerRef.current) {
        const rect = imageContainerRef.current.getBoundingClientRect();
        prevPosition = { ...targetMousePosition };
        targetMousePosition.x = (event.clientX - rect.left) / rect.width;
        targetMousePosition.y = (event.clientY - rect.top) / rect.height;
        aberrationIntensity = 1;
      }
    };

    const handleMouseEnter = (event: MouseEvent) => {
      if (imageContainerRef.current) {
        const rect = imageContainerRef.current.getBoundingClientRect();
        mousePosition.x = targetMousePosition.x = (event.clientX - rect.left) / rect.width;
        mousePosition.y = targetMousePosition.y = (event.clientY - rect.top) / rect.height;
      }
    };

    const handleMouseLeave = () => {
      aberrationIntensity = 0;
    };

    // Add mouse event listeners
    imageContainerRef.current.addEventListener("mousemove", handleMouseMove);
    imageContainerRef.current.addEventListener("mouseenter", handleMouseEnter);
    imageContainerRef.current.addEventListener("mouseleave", handleMouseLeave);

    // Cleanup on unmount
    return () => {
      if (imageContainerRef.current) {
        imageContainerRef.current.removeEventListener("mousemove", handleMouseMove);
        imageContainerRef.current.removeEventListener("mouseenter", handleMouseEnter);
        imageContainerRef.current.removeEventListener("mouseleave", handleMouseLeave);
      }
      if (renderer) {
        renderer.dispose();
        if (imageContainerRef.current) {
          // Remove any existing canvas element
          while (imageContainerRef.current.firstChild) {
            imageContainerRef.current.removeChild(imageContainerRef.current.firstChild);
          }
        }
      }
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700 ease-in-out" ref={imageContainerRef} />
  );
};

export default ImageContainer;
