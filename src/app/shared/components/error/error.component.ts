import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-error',
    template: `
    <div class="error-container">
      <div class="error-icon">⚠️</div>
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
    </div>
  `,
    styles: [`
    .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem;
      text-align: center;
      background-color: #fff3cd;
      border: 1px solid #ffc107;
      border-radius: 8px;
      margin: 1rem;
    }

    .error-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    h3 {
      color: #856404;
      margin: 0 0 0.5rem 0;
    }

    p {
      color: #856404;
      margin: 0;
    }
  `]
})
export class ErrorComponent {
    @Input() title = 'Error';
    @Input() message = 'Something went wrong. Please try again.';
}
