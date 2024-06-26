// authorization/roles/role.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from '../schemas/role.schema';
import { CreateRoleDto, UpdateRoleDto } from './role.dto';

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const { name } = createRoleDto;
    const existingRole = await this.roleModel.findOne({ name }).exec();
    if (existingRole) {
      throw new BadRequestException('Un rôle avec le même nom existe déjà');
    }
    const createdRole = new this.roleModel(createRoleDto);
    return createdRole.save();
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<{ role: Role, message: string }> {
    const { name } = updateRoleDto;
    const existingRole = await this.roleModel.findOne({ name }).exec();
    if (existingRole && existingRole._id.toString() !== id) {
        throw new BadRequestException('Un rôle avec le même nom existe déjà');
    }
    const updatedRole = await this.roleModel.findByIdAndUpdate(id, updateRoleDto, { new: true }).exec();
    return { role: updatedRole, message: 'Rôle mis à jour avec succès' };
}


  async findAll(): Promise<Role[]> {
    return this.roleModel.find().populate('permissions').exec();
  }

  async findOne(id: string): Promise<Role> {
    return this.roleModel.findById(id).populate('permissions').exec();  }

 
  async remove(id: string): Promise<Role> {
    return this.roleModel.findByIdAndDelete(id).exec();
  }
}
