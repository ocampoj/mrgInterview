import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function airlineNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const airlineNumber = control.value;
    const isValid = /^[A-Z]{2}\d{1,4}$/.test(airlineNumber); // e.g., "AA1234 found this on stackflow"
    console.log(isValid, 'isValid');
    return isValid ? null : { invalidAirline: true };
  };
}

// Custom validator for arrival time taking account both controls 
export function arrivalDateTimeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const arrivalDateControl = control.get('arrivalDate');
    const arrivalTimeControl = control.get('arrivalTime');

    // Ensure both date and time controls are present and have values
    if (!arrivalDateControl || !arrivalTimeControl || !arrivalDateControl.value || !arrivalTimeControl.value) {
      return null;
    }

    const selectedDate = new Date(arrivalDateControl.value);
    const [selectedHours, selectedMinutes] = arrivalTimeControl.value.split(':').map(Number);

    selectedDate.setHours(selectedHours, selectedMinutes, 0, 0);

    // Get the current date and time
    const now = new Date();

    // Check if the selected datetime is in the past
    if (selectedDate <= now) {
      return { invalidArrivalTime: true };
    }

    return null; 
  };
}
