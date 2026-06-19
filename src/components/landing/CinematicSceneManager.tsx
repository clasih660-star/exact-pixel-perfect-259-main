import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface SceneState {
  sceneIndex: number;
  sceneProgress: number;
  scrollProgress: number;
}

interface CinematicSceneManagerProps {
  onSceneUpdate: (state: SceneState) => void;
  children: React.ReactNode;
  reducedMotion?: boolean;
}

export const SCENE_DEFINITIONS = [
  { id: "scene-cosmos", label: "Cosmos" },
  { id: "scene-planets", label: "Planets" },
  { id: "scene-earth", label: "Earth Arrival" },
  { id: "scene-network", label: "Global Network" },
  { id: "scene-campus-emergence", label: "Campus Emergence" },
  { id: "scene-campus-exploration", label: "Campus Exploration" },
  { id: "scene-classroom-entry", label: "Classroom Entry" },
  { id: "scene-teacher", label: "AI Teacher" },
  { id: "scene-whiteboard", label: "Smart Whiteboard" },
  { id: "scene-subjects", label: "Subject Worlds" },
  { id: "scene-impact", label: "Global Impact" },
  { id: "scene-final-cta", label: "Final CTA" },
] as const;

export const SCENE_COUNT = SCENE_DEFINITIONS.length;

export const CinematicSceneManager: React.FC<CinematicSceneManagerProps> = ({
  children,
  reducedMotion = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || reducedMotion) return;

    // Standard high-end website scroll entrance reveal for all sections
    const sections = containerRef.current.querySelectorAll("section");
    sections.forEach((section) => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [reducedMotion]);

  return (
    <div ref={containerRef} className="relative z-10 flex flex-col gap-12 md:gap-16 lg:gap-20">
      {React.Children.map(children, (child, index) => {
        if (index >= SCENE_COUNT) return child;
        const scene = SCENE_DEFINITIONS[index];
        return (
          <div id={scene.id} className="w-full relative" data-scene-index={index}>
            {child}
          </div>
        );
      })}
    </div>
  );
};
