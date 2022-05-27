import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseModel, TModelID } from '../base-model';
import { IsUUID } from 'class-validator';

@Entity({
  name: 'refresh_token_collections',
})
export class RefreshTokenCollectionModel extends BaseModel {
  @IsUUID()
  @PrimaryGeneratedColumn('uuid')
  id!: TModelID;

  @Column({ name: 'user_id', nullable: false })
  userId!: string;

  @Column({ name: 'token', nullable: false })
  token!: string;
}
