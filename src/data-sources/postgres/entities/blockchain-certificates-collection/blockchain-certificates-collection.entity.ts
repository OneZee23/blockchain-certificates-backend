import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { BaseModel, TModelID } from '../base-model';
import { IsUUID } from 'class-validator';
import { UserCollectionModel } from "../user-collection/user-collection.entity";

@Entity({
  name: 'blockchain_certificates_collections',
})
export class BlockchainCertificatesCollectionModel extends BaseModel {
  @IsUUID()
  @PrimaryGeneratedColumn('uuid')
  id!: TModelID;

  @ManyToOne(
    () => UserCollectionModel,
    user => user.certificates,
    { nullable: false },
  )
  ownerUser!: UserCollectionModel;

  @Column({ name: 'active_status', nullable: false, default: false })
  activeStatus!: boolean;

  @Column({ name: 'ipfs_hash', nullable: false, unique: true })
  ipfsHash!: string;

  @Column({ name: 'description', nullable: false })
  description!: string;

  @Column({ name: 'transaction_hash', nullable: false })
  transactionHash!: string;

  @Column({ name: 'contract_address', nullable: false })
  contractAddress!: string;
}
