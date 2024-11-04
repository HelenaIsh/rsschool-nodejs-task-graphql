import { GraphQLObjectType, GraphQLList } from 'graphql';
import { UserType } from './types/user.js';
import { PostType } from './types/post.js';
import { ProfileType } from './types/profile.js';
import { MemberType, MemberTypeIdType } from './types/member.js';
import { UUIDType } from './types/uuid.js';

export const query = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args, { prisma }) {
        return prisma.user.findMany();
      },
    },
    user: {
      type: UserType,
      args: { id: { type: UUIDType } },
      resolve: async (parent, { id }, { prisma }) => {
        const user = await prisma.user.findUnique({
          where: { id },
          include: {
            posts: true,
            profile: true,
          },
        });
        if (!user) {
          return null;
        }
        return user;
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args, { prisma }) {
        return prisma.post.findMany();
      },
    },
    post: {
      type: PostType,
      args: { id: { type: UUIDType } },
      resolve(parent, args, { prisma }) {
        return prisma.post.findUnique({ where: { id: args.id } });
      },
    },
    profiles: {
      type: new GraphQLList(ProfileType),
      resolve(parent, args, { prisma }) {
        return prisma.profile.findMany();
      },
    },
    profile: {
      type: ProfileType,
      args: { id: { type: UUIDType } },
      resolve(parent, args, { prisma }) {
        return prisma.profile.findUnique({ where: { id: args.id } });
      },
    },
    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve(parent, args, { prisma }) {
        return prisma.memberType.findMany();
      },
    },
    memberType: {
      type: MemberType,
      args: { id: { type: MemberTypeIdType } },
      resolve: async (parent, { id }, { prisma }) => {
        const memberType = await prisma.memberType.findUnique({
          where: { id },
        });
        if (!memberType) {
          return null;
        }
        return memberType;
      },
    },
    postsByUser: {
      type: new GraphQLList(PostType),
      args: {
        userId: { type: UUIDType },
      },
      resolve: async (parent, { userId }, { prisma }) => {
        const posts = await prisma.post.findMany({
          where: { authorId: userId },
        });
        return posts || null;
      },
    },
  },
});
