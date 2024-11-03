import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {User} from "@entities/User.entity";

@Entity("roles")
export class Role {
    @PrimaryGeneratedColumn()
    roleId: number

    @Column({ length: 50 })
    roleName: string

    @Column("text")
    description: string

    @OneToMany(() => User, user => user.role)
    users: User[]
}