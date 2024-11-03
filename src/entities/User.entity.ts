import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne} from "typeorm"
import { Order } from "./Order.entity"
import { Feedback } from "./Feedback.entity"
import { Log } from "./Log.entity"
import {Role} from "@entities/Role.entity";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    userId: number

    @Column({ length: 40, unique: true })
    login: string

    @Column({ length: 255, unique: true })
    email: string

    @Column({ length: 255, select: false })
    password: string

    @Column()
    roleId: number

    @ManyToOne(() => Role, role => role.users)
    role: Role

    @OneToMany(() => Order, order => order.user)
    orders: Order[]

    @OneToMany(() => Feedback, feedback => feedback.user)
    feedbacks: Feedback[]

    @OneToMany(() => Log, log => log.user)
    logs: Log[]
}