import { MatSnackBar } from '@angular/material/snack-bar';

export function showErrorSnack(
  snackBar: MatSnackBar,
  error: any,
  fallbackMessage = 'An error occurred'
) {
  const message = error?.error?.error || fallbackMessage;

  snackBar.open(message, 'Close', {
    duration: 4000,
    panelClass: ['snack-error'],
  });
}
