import { InjectionToken } from "@angular/core";
import { environment } from "src/environments/environment.prod";

export const API_URL = new InjectionToken('API_URL', {
  factory: () => environment.api
});
