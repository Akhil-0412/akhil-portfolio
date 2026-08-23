import { create } from 'zustand';

// Section ids match the `id` attributes on each <section>/<footer> in app/page.tsx
// and the `navLinks` list in components/Header.tsx.
export type SectionId =
    | 'hero'
    | 'about'
    | 'experience'
    | 'certifications'
    | 'projects'
    | 'skills'
    | 'contact';

interface NavState {
    activeSection: SectionId;
    isChatOpen: boolean;
    setActiveSection: (section: SectionId) => void;
    setChatOpen: (open: boolean) => void;
}

// Shared between Header (writes the section the scroll-spy observer picked, and
// whether the AI chat is open) and HeroRobot (reads both to decide where the
// robot should stand) — they live in unrelated branches of the tree, so this is
// the same cross-component pattern already used by useProjectStore/useCertStore.
const useNavStore = create<NavState>((set) => ({
    activeSection: 'hero',
    isChatOpen: false,
    setActiveSection: (activeSection) => set({ activeSection }),
    setChatOpen: (isChatOpen) => set({ isChatOpen }),
}));

export default useNavStore;
