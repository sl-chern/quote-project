import { Resolver, Query, Args, ObjectType, Field, Mutation } from '@nestjs/graphql';
import { User } from '../../../graphql/types/user.model';
import { UserService } from './user.service';
import { BucketService } from 'src/bucket/bucket.service';

@ObjectType()
class UrlReturn {
  @Field(type => String)
  url: string;
}
@Resolver(of => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly bucketService: BucketService,
  ) {}

  @Query(returns => User)
  async getUserById(@Args('userId') id: string): Promise<User> {
    return this.userService.findById(id);
  }

  @Query(returns => UrlReturn)
  async getImageUrl(): Promise<UrlReturn> {
    return { url: await this.bucketService.generateSignedURL('FxmJJ9TXwAAZ_5u.png') };
  }

  @Mutation(returns => UrlReturn)
  async uploadImage(
    @Args('imageName') imageName: string,
    @Args('image') image: string,
  ): Promise<UrlReturn> {
    return { url: await this.bucketService.uploadFile(imageName, image) };
  }

  @Query(returns => Boolean)
  async deleteImage(@Args('imageName') imageName: string): Promise<boolean> {
    try {
      this.bucketService.deleteFile(imageName);
      return true;
    } catch {
      return false;
    }
  }
}
