import { useEffect, useState } from 'react';

export const useAccessibility = () => {
  const [isToolbarOpen, setIsToolbarOpen] = useState(false);

  // Keyboard shortcut for accessibility toolbar
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Alt + A to toggle accessibility toolbar
      if (event.altKey && event.key === 'a') {
        event.preventDefault();
        setIsToolbarOpen(prev => !prev);
      }
      
      // Escape to close toolbar
      if (event.key === 'Escape' && isToolbarOpen) {
        event.preventDefault();
        setIsToolbarOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isToolbarOpen]);

  // Announce toolbar state to screen readers
  useEffect(() => {
    const message = isToolbarOpen 
      ? 'Accessibility toolbar opened' 
      : 'Accessibility toolbar closed';
    
    // Create live region announcement
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Clean up after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, [isToolbarOpen]);

  return {
    isToolbarOpen,
    toggleToolbar: () => setIsToolbarOpen(prev => !prev),
    closeToolbar: () => setIsToolbarOpen(false),
  };
};

// Screen reader utility functions
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    if (document.body.contains(announcement)) {
      document.body.removeChild(announcement);
    }
  }, 1000);
};

// Focus management utilities
export const focusManagement = {
  trapFocus: (element: HTMLElement) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable?.focus();
        } else if (!e.shiftKey && document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable?.focus();
        }
      }
    };

    element.addEventListener('keydown', handleTabKey);
    firstFocusable?.focus();

    return () => {
      element.removeEventListener('keydown', handleTabKey);
    };
  },

  focusElement: (selector: string, delay: number = 0) => {
    setTimeout(() => {
      const element = document.querySelector(selector) as HTMLElement;
      element?.focus();
    }, delay);
  },

  skipToContent: () => {
    const main = document.querySelector('main') as HTMLElement;
    if (main) {
      main.tabIndex = -1;
      main.focus();
      main.scrollIntoView({ behavior: 'smooth' });
    }
  }
};