import { User } from '@entities/User.entity';
import {
  Column, Entity, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('logs')
export class Log {
    @PrimaryGeneratedColumn()
      logId: number;

    @Column()
      userId: string;

    @Column('text')
      content: string;

    @Column({ length: 20 })
      type: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
      date: Date;

    @ManyToOne(() => User, (user) => user.logs)
      user: User;
}
