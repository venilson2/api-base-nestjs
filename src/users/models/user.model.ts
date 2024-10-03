import { Table, Column, Model, DataType, PrimaryKey } from 'sequelize-typescript';
import { UserPlan } from 'src/common/enums/user-plan.enum';
import { ulid } from 'ulid';

@Table({
  tableName: 'users'
})
export class UserModel extends Model<UserModel> {
@PrimaryKey
@Column({
  type: 'VARCHAR(26)',
  defaultValue: ulid(),
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    }
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.ENUM,
    values: [UserPlan.Free, UserPlan.Basic, UserPlan.Premium],
    allowNull: false,
  })
  plan: UserPlan;

  @Column({
    field: 'full_name',
    type: DataType.STRING,
    allowNull: false,
  })
  fullName: string;

  @Column({
    field: 'refresh_token',
    type: DataType.STRING,
    allowNull: true,
  })
  refreshToken: string;
}