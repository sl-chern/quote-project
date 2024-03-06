import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/database/repository/user.repository';
import { User } from 'src/graphql/types/user.model';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findById(id: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        id,
      },
      relations: ['permissions'],
    });
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findByEmail(email);
  }
}
