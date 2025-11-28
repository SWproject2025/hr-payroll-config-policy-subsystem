
import { PartialType } from "@nestjs/mapped-types";
import { createPayTypeDto } from "./createPayType.dto";

export class updatePayTypeDto extends PartialType( createPayTypeDto ) {}