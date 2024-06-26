import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { CreateUserDTO } from "./dto/create.user.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdatePutUserDTO } from "./dto/update-put-user.dto";
import { UpdatePatchUser } from "./dto/update-patch-user.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

    constructor(private readonly prisma: PrismaService) { }

    async create(data: CreateUserDTO) {

        data.password = await bcrypt.hash(data.password, await bcrypt.genSalt());

        return await this.prisma.user.create({
            data
        });
    }

    async list() {
        return this.prisma.user.findMany();
    }

    async show(idusers: number) {
        await this.exists(idusers);
        return this.prisma.user.findUnique({
            where: {
                idusers,
            }
        });
    }

    async update(idusers: number, { email, name, password, birthDay, role }: UpdatePutUserDTO) {

        await this.exists(idusers);

        password = await bcrypt.hash(password, await bcrypt.genSalt());

        console.log(typeof(role));

        return this.prisma.user.update({
            data: { email, name, password, birthDay: birthDay ? new Date(birthDay) : null , role},
            where: {
                idusers
            }
        })
    }

    async patch(idusers: number, { email, name, password, birthDay, role }: UpdatePatchUser) {

        await this.exists(idusers);

        const data: any = {};

        email && (data.email = email);
        name && (data.name = name);
        password && (data.password = await bcrypt.hash(password, await bcrypt.genSalt()));
        birthDay && (data.birthDay = new Date(birthDay));
        role && (data.role = role);

        return this.prisma.user.update({
            data: data,
            where: {
                idusers
            }
        })
    }

    async delete(idusers: number) {

        await this.exists(idusers);

        return this.prisma.user.delete({
            where: {
                idusers
            }
        })
    }

    async exists(idusers: number) {
        if (!(await this.prisma.user.count({
            where: {
                idusers
            }
        }))) {
            throw new NotFoundException("O usuário com esse id não existe");
        }
    }
}