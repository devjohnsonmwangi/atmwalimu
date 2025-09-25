// src/hooks/usePWA.ts

import { useState, useEffect } from 'react';

// TypeScript interface for the specific event we are listening for.
interface BeforeInstallPromptEvent extends Event {
    readonly platforms: Array<string>;
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;
    prompt(): Promise<void>;
}

// A flag to always show the install button during development for easier testing.
const ALWAYS_SHOW_PWA_BUTTON_FOR_DEV = import.meta.env.DEV;

/**
 * A custom React hook to manage the Progressive Web App (PWA) installation flow.
 * It encapsulates all the logic for listening to installation events and prompting the user.
 */
export const usePWA = () => {
    // State to hold the install prompt event. If it's null, the app can't be installed yet.
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    
    // State to track if the app is already running as a standalone PWA.
    const [isRunningAsPWA, setIsRunningAsPWA] = useState(false);

    useEffect(() => {
        // This handler captures the install prompt event when the browser fires it.
        const handleBeforeInstallPrompt = (e: Event) => {
            // Prevent the mini-infobar from appearing on mobile.
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e as BeforeInstallPromptEvent);
        };

        // This handler clears the prompt once the app is successfully installed.
        const handleAppInstalled = () => {
            setDeferredPrompt(null);
            console.log('Mwalimu PWA was installed.');
        };
        
        // This media query checks if the app is running in standalone mode.
        const mediaQuery = window.matchMedia('(display-mode: standalone)');
        setIsRunningAsPWA(mediaQuery.matches);

        // We also listen for changes in case the user installs the app while it's open.
        const handlePWAChange = (e: MediaQueryListEvent) => {
            setIsRunningAsPWA(e.matches);
        };

        // Add all the event listeners.
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);
        mediaQuery.addEventListener('change', handlePWAChange);
        
        // Cleanup function to remove listeners when the component unmounts.
        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
            mediaQuery.removeEventListener('change', handlePWAChange);
        };
    }, []);

    /**
     * Triggers the PWA installation prompt for the user.
     */
    const handlePWAInstall = async () => {
        if (!deferredPrompt) {
            console.log("Install prompt not available.");
            return;
        }
        // Show the prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        await deferredPrompt.userChoice;
        // We can't use the prompt again, so clear it.
        setDeferredPrompt(null);
    };

    // The final boolean that the UI will use to decide whether to show the install button.
    const shouldShowPWAButton = !isRunningAsPWA && (!!deferredPrompt || ALWAYS_SHOW_PWA_BUTTON_FOR_DEV);

    // Return the state and functions needed by the UI component.
    return { shouldShowPWAButton, handlePWAInstall, isRunningAsPWA };
};