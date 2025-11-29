import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { payrollPoliciesDocument, payrollPolicies } from './models/payrollPolicies.schema';
import { allowanceDocument, allowance } from './models/allowance.schema';
import { CreatePayrollPolicyDto } from './dtos/createPayrollPolicy.dto';
import { UpdatePayrollPolicyDto } from './dtos/updatePayrollPolicy.dto';
import { ConfigStatus } from './enums/payroll-configuration-enums';
import { CreateAllowanceDto } from './dtos/createAllowance.dto';
import { UpdateAllowanceDto } from './dtos/updateAllowance.dto';
import { SystemRole } from '../employee-profile/enums/employee-profile.enums';

//import { EmployeeSystemRoleDocument, EmployeeSystemRole } from '../employee-profile/models/employee-system-role.schema';

@Injectable()
export class PayrollConfigurationService {
 
     constructor(
    @InjectModel(payrollPolicies.name)
    private policyModel: Model<payrollPoliciesDocument>,
    @InjectModel(allowance.name)
    private allowanceModel: Model<allowanceDocument>,
  ) {}
 	 
    //payroll specialist:
    //create / edit payroll policy (draft) and view all

    async createPayrollPolicy(dto: CreatePayrollPolicyDto, userId: string){
        const newPolicy = new this.policyModel({
            ...dto,
            createdBy: userId,
            //status will be draft by default. still:
            status: ConfigStatus.DRAFT
        });
        return await newPolicy.save();
        
    }

    async updatePayrollPolicy(dto: UpdatePayrollPolicyDto, policyId: string, userId: string){
        
    
        const policy = await this.policyModel.findById(policyId);

        if(!policy){
            throw new Error('Payroll Policy not found');
        }
        if(policy.status !== ConfigStatus.DRAFT){
            throw new Error('Only draft policies can be Edited');
        }

        if(policy.createdBy?.toString() !== userId){
            throw new ForbiddenException('You are only allowed to update policies you have created');
        }

        Object.assign(policy, dto);
        return await policy.save();
        
    }

    //get all payroll policies
    async getAllPayrollPolicies(): Promise<payrollPolicies[]> {
        return await this.policyModel.find().exec();
    }

    async getOnePayrollPolicy(id: string): Promise<payrollPolicies> {
        const policy = await this.policyModel.findById(id);
        if(!policy){
            throw new Error('Payroll Policy Not Found');
        }
        return policy;
    }


    //submit for approval. (Note for next time, Use approval-status.enum)
     async submaitForApproval(policyId: string, userId: string){
        const policy = await this.policyModel.findById(policyId);
        
        if(!policy){
            throw new Error('Payroll Policy Not Found');
        }
        if(policy.status !== ConfigStatus.DRAFT){
            throw new Error('Only draft policies can be submitted for approval');
        }
        if(policy.createdBy?.toString() !== userId){
            throw new ForbiddenException('You are only allowed to submit policies you have created');
        }
        
       //policy status remains draft until set to pending by manager, then no editing allowed
        return await policy.save();
        
        // policy.approvalStatus = ApprovalStatus.PENDING;
        // return await policy.save();
    }

    async createAllowance(dto: CreateAllowanceDto, userId: string){
        const newAllowance = new this.allowanceModel({
            ...dto,
            createdBy: userId, //remember to remove created by from dtos
            status: ConfigStatus.DRAFT //policy status remains draft until set to pending by manager, then no editing allowed
        })
        return await newAllowance.save();
    }

    async updateAllowance(dto: UpdateAllowanceDto, userId: string , allowanceId: string){
        const allowance = await this.allowanceModel.findById(allowanceId);
        if(!allowance){
            throw new Error('Allowance not found');
        }
        if(allowance.createdBy?.toString() !== userId){
            throw new ForbiddenException('You are only allowed to update allowances you have created');
        }
        Object.assign(allowance, dto);
        return await allowance.save();
    }

    async findAllAllowances(): Promise<allowance[]> {
        return await this.allowanceModel.find().exec();
    }

    async findOneAllowance(id: string): Promise<allowance> {
        const allowance = await this.allowanceModel.findById(id);
        if(!allowance){
            throw new Error('Allowance Not Found');
        }
        return allowance;
    }

    //manager:
    //approve / reject policies

    async approvePolicy(policyId: string, user: any){
        const policy = await this.policyModel.findById(policyId);
        if(!policy){
            throw new Error('Payroll Policy Not Found');
        }
        if(user !== SystemRole.PAYROLL_MANAGER){
            throw new ForbiddenException('Only payroll managers are allowed to approve policies');
        }
        policy.status = ConfigStatus.APPROVED;
        policy.approvedBy = user._id.toString(); //correct later
        return await policy.save();
        
    }

    async rejectPolicy(policyId: string, user: any){
        const policy = await this.policyModel.findById(policyId);
        if(!policy){
            throw new Error('Payroll Policy Not Found');
        }
        if(user !== SystemRole.PAYROLL_MANAGER){
            throw new ForbiddenException('Only payroll managers are allowed to reject policies');
        }
        policy.status = ConfigStatus.REJECTED;
        policy.approvedBy = user._id.toString(); //correct later
        return await policy.save();
        
    }

    

    
    


        


            
       




 	




    

}
