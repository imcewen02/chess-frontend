import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
	public toasts = signal<Toast[]>([])
	private currentId = 0;
	
	public showToast(toast: Omit<Toast, 'id'>): void {
		const taggedToast = {id: this.currentId++ ,...toast};
		this.toasts.update(list => [...list, taggedToast])

		if (toast.autoHideDelay > 0) {
			setTimeout(() => { this.removeToast(taggedToast.id) }, toast.autoHideDelay)
		}
	}

	public removeToast(toastId: number): void {
		this.toasts.update(list => list.filter(canidate => canidate.id !== toastId));
	}
}

export interface Toast {
	id: number;
	title: string;
	message: string;
	type: 'success' | 'info' | 'danger';
	autoHideDelay: number;
}