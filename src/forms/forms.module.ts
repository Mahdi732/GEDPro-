import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { FormsService } from "./forms.service";
import { FormsResolver } from "./forms.resolver";
import { Form, formSchema } from "./schemas/form.schema";
import { FormResponse, formResponseSchema } from "./schemas/response.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Form.name, schema: formSchema },
      { name: FormResponse.name, schema: formResponseSchema },
    ]),
  ],
  providers: [FormsResolver, FormsService],
  exports: [FormsService],
})
export class FormsModule {}
