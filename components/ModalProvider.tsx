"use client";

import { AnimatePresence } from "framer-motion";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Project } from "@/lib/portfolio";
import ProjectModal from "./ProjectModal";

interface ModalApi {
  openProject: (project: Project) => void;
}

const ModalContext = createContext<ModalApi | null>(null);

export function useModal(): ModalApi {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal doit être utilisé dans <ModalProvider>");
  return ctx;
}

export default function ModalProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<Project | null>(null);

  const openProject = useCallback((project: Project) => setActive(project), []);
  const close = useCallback(() => setActive(null), []);

  const api = useMemo<ModalApi>(() => ({ openProject }), [openProject]);

  return (
    <ModalContext.Provider value={api}>
      {children}
      <AnimatePresence>
        {active && (
          <ProjectModal
            key={active.id}
            project={active}
            onClose={close}
          />
        )}
      </AnimatePresence>
    </ModalContext.Provider>
  );
}
