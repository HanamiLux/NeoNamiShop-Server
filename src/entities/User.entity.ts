import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  BeforeInsert,
  BeforeUpdate,
  JoinColumn,
} from 'typeorm';
import { Role } from '@entities/Role.entity';
import { Order } from '@entities//Order.entity';
import { Feedback } from '@entities//Feedback.entity';
import { Log } from '@entities//Log.entity';
import { PasswordUtils } from '@/utils/password.utils';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
      userId: string;

    @Column({ length: 40, unique: true })
      login: string;

    @Column({ length: 255, unique: true })
      email: string;

    @Column({ length: 255, select: false })
      password: string;

    @Column()
      roleId: number;

    @ManyToOne(() => Role, (role) => role.users)
    @JoinColumn({ name: 'roleId' })
      role: Role;

    @OneToMany(() => Order, (order) => order.user)
      orders: Order[];

    @OneToMany(() => Feedback, (feedback) => feedback.user)
      feedbacks: Feedback[];

    @OneToMany(() => Log, (log) => log.user)
      logs: Log[];

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
      if (this.password) {
        this.password = await PasswordUtils.hash(this.password);
      }
    }

    getRoleName(): string | undefined {
      return this.role.roleName;
    }
}
