'use client';

import { createContext, useState, type CSSProperties, type Dispatch, type ReactNode, type SetStateAction } from 'react';

import { Z_INDEX } from '@/constants/zIndex';

interface ModalItem {
  id: string;
  render: () => ReactNode;
}

interface ModalContextValue {
  setModals: Dispatch<SetStateAction<ModalItem[]>>;
}

export const ModalContext = createContext<ModalContextValue | null>(null);

const backdropStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: Z_INDEX.BACKDROP,
  backgroundColor: 'rgba(17, 17, 17, 0.4)',
};

const modalContainerStyle: CSSProperties = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
};

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modals, setModals] = useState<ModalItem[]>([]);

  return (
    <ModalContext.Provider value={{ setModals }}>
      {children}

      {modals.length > 0 && (
        <div style={backdropStyle}>
          {modals.map(({ id, render }, index) => {
            const isTop = index === modals.length - 1;

            return (
              <div key={id} style={{ ...modalContainerStyle, pointerEvents: isTop ? 'auto' : 'none' }}>
                {render()}
              </div>
            );
          })}
        </div>
      )}
    </ModalContext.Provider>
  );
}
