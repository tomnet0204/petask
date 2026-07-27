type PetAskEvent =
  | 'petask_symptom_page_view'
  | 'petask_symptom_checker_start'
  | 'petask_symptom_checker_step'
  | 'petask_symptom_checker_complete'
  | 'petask_emergency_banner_click';

declare global {
  interface Window {
    gtag?: (command: string, event: string, params?: Record<string, string | number>) => void;
  }
}

export function trackPetAskEvent(
  event: PetAskEvent,
  params?: Record<string, string | number>,
): void {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', event, params);
}
