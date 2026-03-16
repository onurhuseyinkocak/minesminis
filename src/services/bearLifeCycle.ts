/**
 * DEPRECATED: This service is no longer used.
 * The mascot system has been migrated to a Three.js based 3D AI system.
 * All lifecycle behavior is now managed within the ProfessorPaws component itself.
 */

type LifeCycleState = 'idle' | 'teaching' | 'playing' | 'sleeping' | 'eating' | 'goingHome' | 'interacting';

export type BearState = 'idle' | 'walking' | 'dancing' | 'sleeping' | 'celebrating' | 'waving' | 'laughing' | 'thinking' | 'love' | 'singing' | 'surprised' | 'jumping' | 'following';

type LifeCycleListener = (state: { state: LifeCycleState }) => void;

class BearLifeCycleService {
    private state: LifeCycleState = 'idle';
    private listeners: LifeCycleListener[] = [];

    public startLifeCycle() {
        console.warn('bearLifeCycle service is deprecated');
    }

    public stopLifeCycle() {
        console.warn('bearLifeCycle service is deprecated');
    }

    public getState() {
        return { state: this.state };
    }

    public onChange(listener: LifeCycleListener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    public wakeUp() {
        console.warn('bearLifeCycle service is deprecated');
    }
}

export const bearLifeCycle = new BearLifeCycleService();
