import { ConfigStatus } from "../enums/payroll-configuration-enums";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export class ApprovalPayrollPolicyDto {

    @IsEnum(ConfigStatus)
    status: ConfigStatus; // approved/rejected/approved

    @IsString()
    @IsNotEmpty()
    approvedBy: string;
}