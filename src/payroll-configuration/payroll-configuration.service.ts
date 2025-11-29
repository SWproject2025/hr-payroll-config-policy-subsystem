import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { payrollPoliciesDocument, payrollPolicies } from './models/payrollPolicies.schema';
import { CreatePayrollPolicyDto } from './dtos/createPayrollPolicy.dto';
import { UpdatePayrollPolicyDto } from './dtos/updatePayrollPolicy.dto';
import { ConfigStatus } from './enums/payroll-configuration-enums';

@Injectable()
export class PayrollConfigurationService {
 
     constructor(
    @InjectModel(payrollPolicies.name)
    private policyModel: Model<payrollPoliciesDocument>,
  ) {}
 	 
    //payroll specialist:
    //create / edit payroll policy (draft) and view all

    async createPayrollPolicy(dto: CreatePayrollPolicyDto, userId: string){
        const newPolicy = new this.policyModel({
            ...dto,
            createdBy: userId,
            //status will be draft by default
        });
        return await newPolicy.save();
        
    }

    async updatePayrollPolicy(dto: UpdatePayrollPolicyDto, policyId: string){ 
        const updatedPolicy = await this.policyModel.findById(policyId);

        if(!updatedPolicy){
            throw new Error('Payroll Policy not found');
        }
        if(updatedPolicy.status !== ConfigStatus.DRAFT){
            throw new Error('Only draft policies can be Edited');
        }

        Object.assign(updatedPolicy, dto);
        return await updatedPolicy.save();
        
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
        
       //policy status remains draft until set to pending by maneger, then no editing allowed
        return await policy.save();
        
        // policy.approvalStatus = ApprovalStatus.PENDING;
        // return await policy.save();
    }
        


            
       




 	




    

}
