import { FastifyInstance } from 'fastify';
import { GraphQLObjectType, GraphQLList } from 'graphql';
import { UUIDType } from '../types/uuid.js';
import {
  MemberType,
  MemberTypeId,
  PostType,
  UserType,
  ProfileType,
} from '../types/typeQuery.js';

export const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    memberType: {
      type: MemberType,
      args: { id: { type: MemberTypeId } },
      resolve(parent, args, { prisma }: FastifyInstance) {
        return prisma.memberType.findUnique({ where: { id: args.id } });
      },
    },
    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve(parent, args, { prisma }: FastifyInstance) {
        return prisma.memberType.findMany();
      },
    },
    post: {
      type: PostType,
      args: { id: { type: UUIDType } },
      resolve(parent, args, { prisma }: FastifyInstance) {
        return prisma.post.findUnique({ where: { id: args.id } });
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args, { prisma }: FastifyInstance) {
        return prisma.post.findMany();
      },
    },
    user: {
      type: UserType,
      args: { id: { type: UUIDType } },
      resolve(parent, args, { prisma }: FastifyInstance) {
        return prisma.user.findUnique({ where: { id: args.id } });
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args, { prisma }: FastifyInstance) {
        return prisma.user.findMany();
      },
    },
    profile: {
      type: ProfileType,
      args: { id: { type: UUIDType } },
      resolve(parent, args, { prisma }: FastifyInstance) {
        return prisma.profile.findUnique({ where: { id: args.id } });
      },
    },
    profiles: {
      type: new GraphQLList(ProfileType),
      resolve(parent, args, { prisma }: FastifyInstance) {
        return prisma.profile.findMany();
      },
    },
  },
});
