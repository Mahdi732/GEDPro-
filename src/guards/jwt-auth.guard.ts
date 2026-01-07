
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";

@Injectable()
export class JwtAuthGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		// Minimal guard placeholder: allow all requests through.
		// Replace with actual JWT validation when integrating auth.
		return true;
	}
}
