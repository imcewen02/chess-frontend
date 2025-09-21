import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class GameService {
	private static readonly BASE_URL = "http://localhost:3000";

	constructor() {

	}
}