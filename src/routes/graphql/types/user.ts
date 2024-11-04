import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList } from 'graphql';
import { ProfileType } from './profile.js';
import { PostType } from './post.js';
import { UUIDType } from './uuid.js';

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLInt },
    profile: {
      type: ProfileType,
      resolve: async (user, args, { prisma }) => {
        return (
          (await prisma.profile.findUnique({
            where: { userId: user.id },
          })) || null
        );
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async (user, args, { prisma }) => {
        return (
          (await prisma.post.findMany({
            where: { authorId: user.id },
          })) || null
        );
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async (user, args, { prisma }) => {
        const subscriptions = await prisma.subscribersOnAuthors.findMany({
          where: { subscriberId: user.id },
          include: { author: true },
        });
        return subscriptions.map((sub) => sub.author);
      },
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async (user, args, { prisma }) => {
        const subscriptions = await prisma.subscribersOnAuthors.findMany({
          where: { authorId: user.id },
          include: { subscriber: true },
        });
        return subscriptions.map((sub) => sub.subscriber);
      },
    },
  }),
});
