export interface Toast {
	id: number;
	title: string;
	message: string;
	type: 'success' | 'info' | 'danger';
	autoHideDelay: number;
}
