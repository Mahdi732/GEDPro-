import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

export const CurrentUser = createParamDecorator(
	(data: unknown, ctx: ExecutionContext) => {
		try {
			const gqlCtx = GqlExecutionContext.create(ctx);
			const context = gqlCtx.getContext();
			return context.req?.user || context.user || null;
		} catch (e) {
			const request = ctx.switchToHttp().getRequest();
			return request.user || null;
		}
	},
);
