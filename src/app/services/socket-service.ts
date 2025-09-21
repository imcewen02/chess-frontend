import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { io, Socket } from "socket.io-client";
import { AppConstants } from "../app.constants";
import { ToastService } from './toast-service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
	private static readonly BASE_URL = "http://localhost:3000";

	private socket: Socket | null = null;
	private eventListeners = new Map<string, Subject<any>>();

	constructor(
		private toastService: ToastService
	) {
		this.refresh();
	}

	/**
	 * Disconnects the existing socket connection if its there
	 * Opens a new authenticated connection (showing a toast error or failure)
	 * Reconnects all existing event listeners
	 */
	public refresh(): void {
		if (this.socket != null) {
			this.socket.disconnect();
			this.socket = null;
		}

		this.socket = io(
			SocketService.BASE_URL, 
			{ auth: { token: localStorage.getItem(AppConstants.JWT_STORAGE_KEY) } }
		);

		this.socket.on("connect_error", () => {
			this.toastService.showToast({
				title: "Server Connection Error", 
				message: "An error ocurred while connecting to the server",
				type: "danger",
				autoHideDelay: 5000
			})
		})

		this.eventListeners.forEach((subject, eventName) => {
			this.socket!.on(eventName, (data) => subject.next(data));
		});
	}

	/**
	 * Creates an observable for the given event
	 * 
	 * @param eventName the name of the event to listen for
	 * 
	 * @returns an observable wrapping the socket event
	 */
	public listen(eventName: string): Observable<any> {
		const subject = new Subject<any>();
		this.eventListeners.set(eventName, subject);

		this.socket!.on(eventName, (data: any) => subject.next(data));
		
		return this.eventListeners.get(eventName)!.asObservable();
	}

	/**
	 * Emits the given event and any related data
	 * 
	 * @param eventName the name of the event to emit
	 * @param data the payload to emit
	 */
	public emit(eventName: string, data: any): void {
		this.socket!.emit(eventName, data);
	}
}