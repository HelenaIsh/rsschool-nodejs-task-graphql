import { GraphQLObjectType, GraphQLBoolean, GraphQLInt } from 'graphql';
import { MemberType } from './member.js';
import { UUIDType } from './uuid.js';

export const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: {
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberType: {
      type: MemberType,
      resolve(parent, args, { prisma }) {
        return prisma.memberType.findUnique({ where: { id: parent.memberTypeId } }) || null;
      },
    },
  },
});
