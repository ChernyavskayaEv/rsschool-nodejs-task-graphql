import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { FastifyInstance } from 'fastify';
import { MemberTypeId, PostType, UserType, ProfileType } from './RootQuery.js';

const createPost = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  },
});

const createUser = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  },
});

const createProfile = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: {
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberTypeId: { type: new GraphQLNonNull(MemberTypeId) },
    userId: { type: new GraphQLNonNull(UUIDType) },
  },
});

const changePost = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: {
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: UUIDType },
  },
});

const changeUser = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});

const changeProfile = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: {
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: MemberTypeId },
  },
});

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
