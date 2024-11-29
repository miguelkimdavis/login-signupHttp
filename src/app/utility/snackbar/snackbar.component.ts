import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.css'
})
export class SnackbarComponent {

  
  @Input() errorMessage: string | null = null;
  @Input() successMessage: string | null = null;
  
  constructor() { }
  ngOnInit() { }
  
}
