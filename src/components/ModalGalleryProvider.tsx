"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

import { ImageModal, type ModalImageItem } from "@/components/plugins/ImageModal";

type GalleryState = {
  open: boolean;
  items: ModalImageItem[];
  index: number;
};

type ModalGalleryApi = {
  openGallery: (opts: { items: ModalImageItem[]; index?: number }) => void;
  closeGallery: () => void;
};

const Ctx = createContext<ModalGalleryApi | null>(null);

export function useModalGallery() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useModalGallery must be used within <ModalGalleryProvider>");
  return ctx;
}

export function ModalGalleryProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GalleryState>({ open: false, items: [], index: 0 });

  const openGallery = useCallback((opts: { items: ModalImageItem[]; index?: number }) => {
    const items = Array.isArray(opts.items) ? opts.items : [];
    const index = typeof opts.index === "number" ? opts.index : 0;
    setState({ open: true, items, index: Math.max(0, Math.min(index, Math.max(0, items.length - 1))) });
  }, []);

  const closeGallery = useCallback(() => {
    setState((s) => ({ ...s, open: false }));
  }, []);

  const api = useMemo(() => ({ openGallery, closeGallery }), [openGallery, closeGallery]);

  return (
    <Ctx.Provider value={api}>
      {children}
      {/* Single global modal host (only one modal can be open at a time). */}
      <ImageModal
        open={state.open}
        items={state.items}
        index={state.index}
        onChangeIndex={(nextIndex) => setState((s) => ({ ...s, index: nextIndex }))}
        onClose={closeGallery}
      />
    </Ctx.Provider>
  );
}
