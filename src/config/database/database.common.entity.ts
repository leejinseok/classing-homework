import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class Common {
  @CreateDateColumn({
    type: 'datetime',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'datetime',
  })
  updatedAt: Date;
}
