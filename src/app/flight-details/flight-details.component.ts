import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { map, Observable, startWith } from 'rxjs';
import { airlineNumberValidator, arrivalDateTimeValidator, wholeNumberValidator } from '../utility/flightValidator';
import { OnlyWholeNumberDirective } from '../utility/only-whole-number.directive';
import { FlightInfoService } from '../flight-info.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NotificationService } from '../notification-snack.service';

@Component({
  selector: 'app-flight-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatButtonModule,
    MatSnackBarModule,
    OnlyWholeNumberDirective
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' }
  ],
  templateUrl: './flight-details.component.html',
  styleUrls: ['./flight-details.component.scss']
})
export class FlightDetailsComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  submitted = false;

  // Define airlines list
  public airlineLabelOptions: string[] = [
    'Delta Air Lines',
    'United Airlines',
    'Southwest Airlines',
    'Alaska Airlines',
    'JetBlue Airways',
    'Spirit Airlines',
    'Frontier Airlines',
    'Hawaiian Airlines',
    'Allegiant Air',
    'Sun Country Airlines',
    'Endeavor Air',
    'SkyWest Airlines',
    'Mesa Airlines',
    'Republic Airways'
  ];

  // Observable to hold filtered options
  filteredAirlines!: Observable<string[]>;

  constructor(
    private _formBuilder: FormBuilder, 
    private _flightInfoService: FlightInfoService,
    private notificationService: NotificationService) {}

  private readonly _currentYear = new Date().getFullYear();
  private readonly _currentDate = new Date();
  readonly minDate = new Date(this._currentDate);
  readonly maxDate = new Date(this._currentYear + 1, 11, 31);

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      airline: ['', [Validators.required]], // Initialize without the custom validator was getting errors if I tried to initalized it with the form builder
      arrivalDate: ['', Validators.required],
      arrivalTime: ['', [Validators.required]],
      flightNumber: ['', [Validators.required, airlineNumberValidator()]],
      numOfGuests: [1, [Validators.required, Validators.min(1), wholeNumberValidator()]],
      comments: ['']
    }, 
    { validators: arrivalDateTimeValidator() } ); // Apply the validator to the entire form since I NEED the selected date in order validate the time correctly. 

    this.filteredAirlines = this.form.get('airline')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterAirlines(value || ''))
    );

    // Use valueChanges to validate input against the lst
    this.form.get('airline')!.valueChanges.subscribe(value => {
      const airlineControl = this.form.get('airline');
      if (airlineControl && !this.airlineLabelOptions.includes(value)) {
        airlineControl.setErrors({ invalidAirline: true });
      } else if (airlineControl?.hasError('invalidAirline')) {
        airlineControl.setErrors(null); 
      }
    });
  }

  // Filtering function for autocomplete
  private _filterAirlines(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.airlineLabelOptions.filter(option =>
      option.toLowerCase().includes(filterValue)
    );
  }

  //getter ti access controles without having to repleat this.form 
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit(): void {
    this.submitted = true;
  
    if (this.form.invalid) {
      return;
    }
  
    // Call the service and pass the form data
    this._flightInfoService.submitFlightInfo(this.form.value).subscribe({
      next: (response) => {
        console.log('Success:', response);
        this.notificationService.showNotification('Flight information submitted successfully!', 'success');
      },
      error: (error) => {
        console.error('Error:', error);
        this.notificationService.showNotification('Failed to submit flight information. Please try again.', 'error');
      }
    });
  }

  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }
}
