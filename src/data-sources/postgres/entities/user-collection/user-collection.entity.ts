import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { BaseModel, TModelID } from '../base-model';
import { IsUUID } from 'class-validator';
import { BlockchainCertificatesCollectionModel } from "../blockchain-certificates-collection";

@Entity({
  name: 'user_collections',
})
export class UserCollectionModel extends BaseModel {
  @IsUUID()
  @PrimaryGeneratedColumn('uuid')
  id!: TModelID;

  @Column({ name: 'blockchain_address', nullable: false, unique: true })
  blockchainAddress!: string;

  @Column({ name: 'username', nullable: false })
  username!: string;

  @Column({ name: 'password', nullable: false })
  password!: string;

  @Column({ name: 'first_name', nullable: false })
  firstName!: string;

  @Column({ name: 'last_name', nullable: false })
  lastName!: string;

  @OneToMany(
    () => BlockchainCertificatesCollectionModel,
    certificate => certificate.ownerUser,
    { nullable: true },
  )
  certificates?: BlockchainCertificatesCollectionModel[];
}
