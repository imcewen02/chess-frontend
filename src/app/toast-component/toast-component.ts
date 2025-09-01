import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ToastService } from '../services/toast-service';

@Component({
  selector: 'app-toasts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast-component.html',
  styleUrl: './toast-component.css'
})
export class ToastContainerComponent {
  constructor(protected toastService: ToastService) { }
}