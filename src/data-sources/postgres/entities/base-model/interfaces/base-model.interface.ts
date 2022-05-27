export declare type TModelID = string;

export interface IBaseModel {
  readonly createdAt: Date;
  readonly updatedAt: Date;
  isDeleted: boolean;
  deletedAt?: Date;
}
