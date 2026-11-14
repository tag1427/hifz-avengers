import { useEffect, type RefObject } from 'react';

/**
 * Attaches light-dismiss behavior for <dialog closedby="any"> when running in browsers
 * without native closedBy support (e.g. Safari), and resets dialog.returnValue on close.
 */
export function useNativeDialogControls(
  dialogRef: RefObject<HTMLDialogElement | null>,
  isOpen: boolean,
  onClose: (returnValue: string) => void,
  allowBackdropDismiss: boolean = true
): void {
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [dialogRef, isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      const value = dialog.returnValue;
      dialog.returnValue = '';
      onClose(value);
    };

    dialog.addEventListener('close', handleClose);

    // Fallback for browsers where HTMLDialogElement.prototype.closedBy is unsupported
    const supportsClosedBy = 'closedBy' in HTMLDialogElement.prototype;
    let cleanupPointerListeners: (() => void) | undefined;

    if (allowBackdropDismiss && !supportsClosedBy) {
      let pressedOutside = false;
      const isOutside = (e: PointerEvent) => {
        const rect = dialog.getBoundingClientRect();
        return (
          e.clientX < rect.left ||
          e.clientX > rect.right ||
          e.clientY < rect.top ||
          e.clientY > rect.bottom
        );
      };

      const onPointerDown = (e: PointerEvent) => {
        pressedOutside = isOutside(e);
      };
      const onPointerUp = (e: PointerEvent) => {
        if (pressedOutside && isOutside(e)) {
          dialog.close('');
        }
        pressedOutside = false;
      };

      dialog.addEventListener('pointerdown', onPointerDown);
      dialog.addEventListener('pointerup', onPointerUp);

      cleanupPointerListeners = () => {
        dialog.removeEventListener('pointerdown', onPointerDown);
        dialog.removeEventListener('pointerup', onPointerUp);
      };
    }

    return () => {
      dialog.removeEventListener('close', handleClose);
      cleanupPointerListeners?.();
    };
  }, [dialogRef, onClose, allowBackdropDismiss]);
}
