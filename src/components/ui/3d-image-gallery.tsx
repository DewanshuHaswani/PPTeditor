// @ts-nocheck
"use client";

import React, { Suspense, useEffect, useMemo, useRef, useState, createContext, useContext } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Html, Plane, Sphere } from "@react-three/drei";
import { ArrowRight, Heart, X } from "lucide-react";

export type GalleryCard = {
  id: string;
  imageUrl: string;
  alt: string;
  title: string;
  subtitle?: string;
  slideNumber?: number | null;
};

type CardContextType = {
  selectedCard: GalleryCard | null;
  setSelectedCard: (card: GalleryCard | null) => void;
  cards: GalleryCard[];
  onSelect?: (card: GalleryCard) => void;
};

const CardContext = createContext<CardContextType | undefined>(undefined);

function useCard() {
  const ctx = useContext(CardContext);
  if (!ctx) throw new Error("useCard must be used within CardProvider");
  return ctx;
}

function CardProvider({
  children,
  cards,
  onSelect
}: {
  children: React.ReactNode;
  cards: GalleryCard[];
  onSelect?: (card: GalleryCard) => void;
}) {
  const [selectedCard, setSelectedCard] = useState<GalleryCard | null>(null);

  return <CardContext.Provider value={{ selectedCard, setSelectedCard, cards, onSelect }}>{children}</CardContext.Provider>;
}

function StarfieldBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 1);
    mountRef.current.appendChild(renderer.domElement);

    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 10000;
    const positions = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2000;
    }
    starsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.7, sizeAttenuation: true });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    camera.position.z = 10;

    let animationId = 0;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      stars.rotation.y += 0.0001;
      stars.rotation.x += 0.00005;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      starsGeometry.dispose();
      starsMaterial.dispose();
    };
  }, []);

  return <div ref={mountRef} className="fixed left-0 top-0 z-0 h-full w-full bg-black" />;
}

function FloatingCard({
  card,
  position
}: {
  card: GalleryCard;
  position: { x: number; y: number; z: number; rotationX: number; rotationY: number; rotationZ: number };
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const { setSelectedCard } = useCard();

  useFrame(({ camera }) => {
    if (groupRef.current) {
      groupRef.current.lookAt(camera.position);
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    setSelectedCard(card);
  };
  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = "pointer";
  };
  const handlePointerOut = (e: any) => {
    e.stopPropagation();
    setHovered(false);
    document.body.style.cursor = "auto";
  };

  return (
    <group ref={groupRef} position={[position.x, position.y, position.z]}>
      <Plane ref={meshRef} args={[4.5, 6]} onClick={handleClick} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
        <meshBasicMaterial transparent opacity={0} />
      </Plane>

      <Html
        transform
        distanceFactor={10}
        position={[0, 0, 0.01]}
        style={{
          transition: "all 0.3s ease",
          transform: hovered ? "scale(1.15)" : "scale(1)",
          pointerEvents: "auto"
        }}
      >
        <div
          onClick={handleClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          className="h-52 w-40 select-none overflow-hidden rounded-lg bg-[#1F2121] p-3 shadow-2xl"
          style={{
            boxShadow: hovered ? "0 25px 50px rgba(49, 184, 198, 0.5), 0 0 30px rgba(49, 184, 198, 0.3)" : "0 15px 30px rgba(0, 0, 0, 0.6)",
            border: hovered ? "2px solid rgba(49, 184, 198, 0.5)" : "1px solid rgba(255, 255, 255, 0.1)"
          }}
        >
          <img src={card.imageUrl || "/placeholder.svg"} alt={card.alt} className="h-40 w-full rounded-md object-cover" loading="lazy" draggable={false} />
          <div className="mt-1 text-center">
            <p className="truncate text-xs font-medium text-white">{card.title}</p>
          </div>
        </div>
      </Html>
    </group>
  );
}

function CardModal() {
  const { selectedCard, setSelectedCard, onSelect } = useCard();
  const [isFavorited, setIsFavorited] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!selectedCard) return null;

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseEnter = () => {};
  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transition = "transform 0.5s ease-out";
      cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    }
  };

  const toggleFavorite = () => setIsFavorited((v) => !v);
  const handleClose = () => setSelectedCard(null);
  const handleBackdropClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };
  const handleSelect = () => {
    onSelect?.(selectedCard);
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={handleBackdropClick}>
      <div className="relative mx-4 w-full max-w-md">
        <button onClick={handleClose} className="absolute -top-12 right-0 z-10 text-white transition-colors hover:text-gray-300">
          <X className="h-8 w-8" />
        </button>

        <div style={{ perspective: "1000px" }} className="w-full">
          <div
            ref={cardRef}
            className="relative w-full cursor-pointer rounded-[16px] bg-[#1F2121] p-4 transition-all duration-500 ease-out"
            style={{
              transformStyle: "preserve-3d",
              boxShadow: "rgba(0, 0, 0, 0.01) 0px 520px 146px 0px, rgba(0, 0, 0, 0.04) 0px 333px 133px 0px, rgba(0, 0, 0, 0.26) 0px 83px 83px 0px, rgba(0, 0, 0, 0.29) 0px 21px 46px 0px"
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="relative mb-4 w-full" style={{ aspectRatio: "3 / 4" }}>
              <img
                loading="lazy"
                className="absolute inset-0 h-full w-full rounded-[16px] bg-[#000000] object-cover"
                alt={selectedCard.alt}
                src={selectedCard.imageUrl || "/placeholder.svg"}
                style={{ boxShadow: "rgba(0, 0, 0, 0.05) 0px 5px 6px 0px", opacity: 1 }}
              />
            </div>

            <h3 className="mb-2 text-center text-lg font-semibold text-white">{selectedCard.title}</h3>
            {selectedCard.subtitle ? <p className="mb-2 text-center text-sm text-white/60">{selectedCard.subtitle}</p> : null}
            {selectedCard.slideNumber ? <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-[#31b8c6]">Slide {selectedCard.slideNumber}</p> : null}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSelect}
                className="inline-flex h-9 flex-1 items-center justify-center rounded-lg text-base font-medium text-black outline-none transition duration-300 ease-out hover:opacity-80 active:scale-[0.97]"
                style={{ backgroundColor: "#31b8c6" }}
              >
                <div className="flex items-center gap-1.5">
                  <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
                  <span>{selectedCard.slideNumber ? `Enter Slide ${selectedCard.slideNumber}` : "Enter Section"}</span>
                </div>
              </button>
              <button
                type="button"
                onClick={toggleFavorite}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-black outline-none transition duration-300 ease-out hover:opacity-80 active:scale-[0.97]"
                style={{ backgroundColor: "#31b8c6" }}
              >
                <Heart className="h-4 w-4" strokeWidth={1.8} fill={isFavorited ? "currentColor" : "none"} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CardGalaxy() {
  const { cards } = useCard();

  const cardPositions = useMemo(() => {
    const positions: {
      x: number;
      y: number;
      z: number;
      rotationX: number;
      rotationY: number;
      rotationZ: number;
    }[] = [];
    const numCards = cards.length;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;

    for (let i = 0; i < numCards; i++) {
      if (numCards <= 8) {
        const theta = (2 * Math.PI * i) / numCards - Math.PI / 2;
        const radius = 8.2;
        positions.push({
          x: Math.cos(theta) * radius,
          y: Math.sin(theta) * 3.4,
          z: Math.sin(theta) * radius * 0.34,
          rotationX: 0,
          rotationY: theta,
          rotationZ: 0
        });
        continue;
      }
      const y = numCards === 1 ? 0 : 1 - (i / (numCards - 1)) * 2;
      const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = (2 * Math.PI * i) / goldenRatio;
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;
      const layerRadius = 10 + (i % 3) * 3;

      positions.push({
        x: x * layerRadius,
        y: y * layerRadius,
        z: z * layerRadius,
        rotationX: Math.atan2(z, Math.sqrt(x * x + y * y)),
        rotationY: Math.atan2(x, z),
        rotationZ: (Math.random() - 0.5) * 0.2
      });
    }
    return positions;
  }, [cards.length]);

  return (
    <>
      <Sphere args={[2, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#1a1a2e" transparent opacity={0.15} wireframe />
      </Sphere>
      <Sphere args={[12, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#31b8c6" transparent opacity={0.05} wireframe />
      </Sphere>
      <Sphere args={[16, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#31b8c6" transparent opacity={0.03} wireframe />
      </Sphere>
      <Sphere args={[20, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#31b8c6" transparent opacity={0.02} wireframe />
      </Sphere>

      {cards.map((card, i) => (
        <FloatingCard key={card.id} card={card} position={cardPositions[i]} />
      ))}
    </>
  );
}

export default function StellarCardGallerySingle({
  cards,
  onSelect,
  title = "Movie Mode",
  subtitle = "Drag to look around - Scroll to zoom - Click a group to enter"
}: {
  cards?: GalleryCard[];
  onSelect?: (card: GalleryCard) => void;
  title?: string;
  subtitle?: string;
}) {
  const fallbackCards: GalleryCard[] = [
    { id: "1", imageUrl: "https://i.ibb.co/4ZWcP129/1.png", alt: "Elegant Invitation", title: "Elegant Invitation" },
    { id: "2", imageUrl: "https://i.ibb.co/TMbhBRcL/2.png", alt: "Modern Design", title: "Modern Design" },
    { id: "3", imageUrl: "https://i.ibb.co/spXBFdSm/3.png", alt: "Vintage Style", title: "Vintage Style" },
    { id: "4", imageUrl: "https://i.ibb.co/N2TCN0bC/4.png", alt: "Minimalist", title: "Minimalist" },
    { id: "5", imageUrl: "https://i.ibb.co/jZkh6q1M/5.png", alt: "Floral Design", title: "Floral Design" }
  ];

  return (
    <CardProvider cards={cards?.length ? cards : fallbackCards} onSelect={onSelect}>
      <div className="relative h-screen w-full overflow-hidden bg-black">
        <StarfieldBackground />

        <Canvas
          camera={{ position: [0, 0, 15], fov: 60 }}
          className="absolute inset-0 z-10"
          onCreated={({ gl }) => {
            gl.domElement.style.pointerEvents = "auto";
          }}
        >
          <Suspense fallback={null}>
            <Environment preset="night" />
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={0.6} />
            <pointLight position={[-10, -10, -10]} intensity={0.3} />
            <CardGalaxy />
            <OrbitControls enablePan enableZoom enableRotate minDistance={5} maxDistance={40} autoRotate={false} rotateSpeed={0.5} zoomSpeed={1.2} panSpeed={0.8} target={[0, 0, 0]} />
          </Suspense>
        </Canvas>

        <CardModal />

        <div className="pointer-events-none absolute left-4 top-4 z-20 text-white">
          <h1 className="mb-2 text-2xl font-bold">{title}</h1>
          <p className="text-sm opacity-70">{subtitle}</p>
        </div>
      </div>
    </CardProvider>
  );
}
