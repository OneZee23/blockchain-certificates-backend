import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IBaseModel } from './interfaces';
import { IsBoolean, IsDate, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export abstract class BaseModel implements IBaseModel {
  /**
   * Creation date and time
   */
  @IsDate()
  @Transform((value: Date) => value.toISOString(), { toPlainOnly: true })
  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  readonly createdAt!: Date;

  /**
   * Last update date and time
   */
  @IsDate()
  @Transform((value: Date) => value.toISOString(), { toPlainOnly: true })
  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  readonly updatedAt!: Date;

  /**
   * logic remove flag
   */
  @IsBoolean()
  @Column({
    type: 'boolean',
    default: false,
    name: 'is_deleted',
  })
  readonly isDeleted!: boolean;

  /**
   * Date and time of logic remove
   */
  @IsOptional()
  @IsDate()
  @Transform((value: Date) => (!value ? value : value.toISOString()), {
    toPlainOnly: true,
  })
  @Column({
    type: 'timestamp with time zone',
    nullable: true,
    name: 'deleted_at',
  })
  readonly deletedAt?: Date;
}
