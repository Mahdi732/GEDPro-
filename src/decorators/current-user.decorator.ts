import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentUser = createParamDecorator(
	(data: unknown, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest();
		// For GraphQL context usage, NestJS will attach the request on the context object.
		return request.user || (ctx.getArgByIndex && ctx.getArgByIndex(2)?.req?.user) || null;
	},
);
