
 	
//Pay grades(Position ,Gross Salary= base Pay+ allowances) configuration : (Create , Edit ,View)  status :draft

import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";


export class CreatePayGradeDto {

    @IsString()
    @IsNotEmpty()
    grade: string;

    @IsNumber()
    @Min(6000)
    baseSalary: number;

    //gross salary = base pay + allowances, Auto calculatedd
    @IsNumber()
    @Min(6000)
    grossSalary: number;

    //status draft default

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    createdBy?: string;


}