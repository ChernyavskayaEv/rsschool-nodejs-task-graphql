import { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { FastifyInstance } from 'fastify';
import { PostType, UserType, ProfileType } from '../types/typeQuery.js';
import {
  createPost,
  createUser,
  changeProfile,
  changePost,
  changeUser,
  createProfile,
} from '../types/typeMutation.js';

export const RootMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createPost: {
      type: PostType,
      args: { dto: { type: new GraphQLNonNull(createPost) } },
      resolve(parent, args, { prisma }: FastifyInstance) {
        return prisma.post.create({
          data: args.dto,
        });
      },
    },

    createUser: {
      type: UserType,
      args: { dto: { type: new GraphQLNonNull(createUser) } },
      resolve(parent, args, { prisma }: FastifyInstance) {
        return prisma.user.create({
          data: args.dto,
        });
      },
    },

    createProfile: {
      type: ProfileType,
      args: { dto: { type: new GraphQLNonNull(createProfile) } },
      resolve(parent, args, { prisma }: FastifyInstance) {
        return prisma.profile.create({
          data: args.dto,
        });
      },
    },

    deletePost: {
      type: GraphQLBoolean,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (parent, args, { prisma }: FastifyInstance) => {
        await prisma.post.delete({
          where: {
            id: args.id,
          },
        });
      },
    },

    deleteUser: {
      type: GraphQLBoolean,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (parent, args, { prisma }: FastifyInstance) => {
        await prisma.user.delete({
          where: {
            id: args.id,
          },
        });
      },
    },

    deleteProfile: {
      type: GraphQLBoolean,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (parent, args, { prisma }: FastifyInstance) => {
        await prisma.profile.delete({
          where: {
            id: args.id,
          },
        });
      },
    },

    changePost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(changePost) },
      },
      resolve(parent, args, { prisma }: FastifyInstance) {
        return prisma.post.update({
          where: { id: args.id },
          data: args.dto,
        });
      },
    },

    changeUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(changeUser) },
      },
      resolve(parent, args, { prisma }: FastifyInstance) {
        return prisma.user.update({
          where: { id: args.id },
          data: args.dto,
        });
      },
    },

    changeProfile: {
      type: ProfileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(changeProfile) },
      },
      resolve(parent, args, { prisma }: FastifyInstance) {
        return prisma.profile.update({
          where: { id: args.id },
          data: args.dto,
        });
      },
    },

    subscribeTo: {
      type: UserType,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve(parent, args, { prisma }: FastifyInstance) {
        return prisma.user.update({
          where: { id: args.userId },
          data: {
            userSubscribedTo: {
              create: {
                authorId: args.authorId,
              },
            },
          },
        });
      },
    },

    unsubscribeFrom: {
      type: GraphQLBoolean,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (parent, args, { prisma }: FastifyInstance) => {
        await prisma.user.update({
          where: { id: args.userId },
          data: {
            userSubscribedTo: {
              deleteMany: {
                authorId: args.authorId,
              },
            },
          },
        });
        return null;
      },
    },
  },
});
