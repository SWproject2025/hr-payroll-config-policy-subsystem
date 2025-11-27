
import { PartialType } from "@nestjs/mapped-types";
import e from "express";
import { createPayTypeDto } from "./createPayType.dto";

export class updatePayTypeDto extends PartialType( createPayTypeDto ) {}