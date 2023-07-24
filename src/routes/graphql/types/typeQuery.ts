import { FastifyInstance } from 'fastify';
import {
  GraphQLObjectType,
  GraphQLEnumType,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLList,
  GraphQLBoolean,
} from 'graphql';
import { UUIDType } from './uuid.js';

export const MemberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    basic: { value: 'basic' },
    business: { value: 'business' },
  },
});

export const MemberType = new GraphQLObjectType({
  name: 'member',
  fields: () => ({
    id: { type: MemberTypeId },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
  }),
});

export const PostType = new GraphQLObjectType({
  name: 'post',
  fields: () => ({
    id: { type: UUIDType },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: UUIDType },
  }),
});

export const ProfileType = new GraphQLObjectType({
  name: 'profile',
  fields: () => ({
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberType: {
      type: MemberType,
      resolve(parent, args, { prisma }: FastifyInstance) {
        return prisma.memberType.findUnique({ where: { id: parent.memberTypeId } });
      },
    },
    memberTypeId: { type: MemberTypeId },
  }),
});

export const UserType = new GraphQLObjectType({
  name: 'user',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: {
      type: ProfileType,
      resolve(parent, args, { prisma }: FastifyInstance) {
        return prisma.profile.findUnique({ where: { userId: parent.id } });
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args, { prisma }: FastifyInstance) {
        return prisma.post.findMany({ where: { authorId: parent.id } });
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve(parent, args, { prisma }: FastifyInstance) {
        return prisma.user.findMany({
          where: {
            subscribedToUser: {
              some: {
                subscriberId: parent.id,
              },
            },
          },
        });
      },
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve(parent, args, { prisma }: FastifyInstance) {
        return prisma.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                authorId: parent.id,
              },
            },
          },
        });
      },
    },
  }),
});
