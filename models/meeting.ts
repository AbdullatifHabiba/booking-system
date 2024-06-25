import { Table, Column, Model, ForeignKey, DataType, BelongsTo } from 'sequelize-typescript';
import { User } from './user';

@Table
export class Meeting extends Model {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  meetingId!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  startTime!: Date;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  duration!: number;
}
