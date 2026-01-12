import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { FormsService } from "./forms.service";
import { FormsResolver } from "./forms.resolver";
import { Form, formSchema } from "./schemas/form.schema";
import { FormResponse, formResponseSchema } from "./schemas/response.schema";
import { RolesGuard } from "../guards/roles.guard";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Form.name, schema: formSchema },
      { name: FormResponse.name, schema: formResponseSchema },
    ]),
  ],
  providers: [FormsResolver, FormsService, RolesGuard],
  exports: [FormsService],
})
export class FormsModule {}
