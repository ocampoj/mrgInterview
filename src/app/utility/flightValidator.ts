import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function airlineNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const airlineNumber = control.value;
    const isValid = /^[A-Z]{2}\d{1,4}$/.test(airlineNumber); // e.g., "AA1234 found this on stackflow"
    console.log(isValid, 'isValid');
    return isValid ? null : { invalidAirline: true };
  };
}

// Custom validator for arrival time
export function arrivalTimeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const selectedTime = control.value;
    if (!selectedTime) return null;  
    
    const [selectedHours, selectedMinutes] = selectedTime.split(':').map(Number);

    // Get current time
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();

    // Check if the selected time is in the past
    if (
      selectedHours < currentHours ||
      (selectedHours === currentHours && selectedMinutes <= currentMinutes)
    ) {
      return { invalidArrivalTime: true };
    }

    return null; // No error if selected time is in the future
  };
}