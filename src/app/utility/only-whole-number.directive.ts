import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appOnlyWholeNumber]',
  standalone: true
})
export class OnlyWholeNumberDirective {
  constructor(private ngControl: NgControl) {}
 //this approach is way better since it prevents it from happening and not just validating it
  @HostListener('input', ['$event'])
  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');

    this.ngControl.control?.setValue(input.value);
  }

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent): void {
    // Prevent the user from typing a decimal point or other non-integer characters
    if (event.key === '.' || event.key === '-' || event.key === 'e') {
      event.preventDefault();
    }
  }
}
