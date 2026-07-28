import { create } from 'zustand';

type SwipeDirection = 'left' | 'right' | null;

interface CertState {
    activeSwipe: SwipeDirection;
    triggerSwipe: (direction: SwipeDirection) => void;
}

// Keep a reference to the active timeout to clear it if another swipe happens rapidly
let swipeTimeout: NodeJS.Timeout | null = null;

const useCertStore = create<CertState>((set) => ({
    activeSwipe: null,
    triggerSwipe: (direction) => {
        set({ activeSwipe: direction });
    },
}));

export default useCertStore;
