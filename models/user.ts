import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Booking } from './booking';
import { Meeting } from './meeting';
import sequelize from '@/utils/database';

@Table
export class User extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @HasMany(() => Booking)
  bookings!: Booking[];

  @HasMany(() => Meeting)
  meetings!: Meeting[];
}

