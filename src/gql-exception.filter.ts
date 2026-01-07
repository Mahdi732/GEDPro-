import { Catch, HttpException } from "@nestjs/common";
import { GqlExceptionFilter } from "@nestjs/graphql";
import { GraphQLError } from "graphql";

@Catch(HttpException)
export class AppExeptionFilter implements GqlExceptionFilter {
    catch(exception: HttpException) {
        const response = exception.getResponse();
        const statu = exception.getStatus();

        const message = typeof response === "string" ? response : (<any>response).message;
            
        return new GraphQLError(message, {
            extensions: {
                code: exception.name || 'Server Error!!!!!',
                statu: statu
            }
        });
    }
}