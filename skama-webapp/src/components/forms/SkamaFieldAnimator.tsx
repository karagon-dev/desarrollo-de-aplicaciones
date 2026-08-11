import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

type FieldControl = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

function isFieldControl(target: EventTarget | null): target is FieldControl {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  );
}

function isFilled(control: FieldControl) {
  if (control instanceof HTMLSelectElement) {
    return true;
  }

  return control.value.trim().length > 0;
}

function syncField(control: FieldControl) {
  const field = control.closest('.sk-field');
  field?.classList.toggle('is-filled', isFilled(control));
}

function syncFields(root: ParentNode = document) {
  root.querySelectorAll<FieldControl>('.sk-field .sk-input').forEach(syncField);
}

export function SkamaFieldAnimator() {
  const location = useLocation();

  useLayoutEffect(() => {
    function handleFieldEvent(event: Event) {
      if (isFieldControl(event.target) && event.target.classList.contains('sk-input')) {
        syncField(event.target);
      }
    }

    syncFields();
    const animationFrame = window.requestAnimationFrame(() => syncFields());
    const observer = new MutationObserver(() => syncFields());

    observer.observe(document.body, { childList: true, subtree: true });
    document.addEventListener('input', handleFieldEvent, true);
    document.addEventListener('change', handleFieldEvent, true);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      observer.disconnect();
      document.removeEventListener('input', handleFieldEvent, true);
      document.removeEventListener('change', handleFieldEvent, true);
    };
  }, [location.pathname, location.search]);

  return null;
}
