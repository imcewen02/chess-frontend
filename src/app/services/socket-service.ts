import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { io, Socket } from "socket.io-client";
import { AppConstants } from "../app.constants";
import { ToastService } from './toast-service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
	private static readonly BASE_URL = "http://localhost:3000";

	private socket!: Socket;

	constructor(
		private toastService: ToastService
	) {
		this.refresh();
	}

	/**
	 * Sets up the socket connection with a default listener for a connection error
	 */
	public refresh(): void {
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
	}

	/**
	 * Creates an observable for the given event
	 * 
	 * @param eventName the name of the event to listen for
	 */
	public listen(eventName: string): Observable<any> {
		return new Observable((subscriber) => {
			this.socket.on(eventName, (data) => { subscriber.next(data); });
		});
	}

	/**
	 * Emits the given event and any related data
	 * 
	 * @param eventName the name of the event to emit
	 * @param data the payload to emit
	 */
	public emit(eventName: string, data: any): void {
		this.socket.emit(eventName, data);
	}
}