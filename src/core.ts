import prisma from "./database";
import { STATUS } from "./static";

const getRatingStatus = async (userId: string) => {
  const status = await prisma.ratingStatus.findUnique({
    where: { userId },
    select: {
      channelId: true,
      ratingMsg: {
        select: {
          subject: true,
          text: true,
          aspect1: true,
          aspect2: true,
          aspect3: true,
          aspect4: true,
          aspect5: true,
          sexy: true,
        },
      },
    },
  });

  if (!status || !status.channelId) {
    return STATUS.EMPTY;
  }

  if (status.channelId && !status.ratingMsg.subject) {
    return STATUS.TEACHER;
  }

  if (status.ratingMsg.subject && !status.ratingMsg.text) {
    return STATUS.SUBJECT;
  }

  if (status.ratingMsg.text && !status.ratingMsg.aspect1) {
    return STATUS.TEXT;
  }

  if (status.ratingMsg.aspect1 && !status.ratingMsg.aspect2) {
    return STATUS.ASPECT1;
  }

  if (status.ratingMsg.aspect2 && !status.ratingMsg.aspect3) {
    return STATUS.ASPECT2;
  }

  if (status.ratingMsg.aspect3 && !status.ratingMsg.aspect4) {
    return STATUS.ASPECT3;
  }

  if (status.ratingMsg.aspect4 && !status.ratingMsg.aspect5) {
    return STATUS.ASPECT4;
  }

  if (status.ratingMsg.aspect5 && !status.ratingMsg.sexy) {
    return STATUS.ASPECT5;
  }

  throw new Error("Unkown status");
};

// eslint-disable-next-line import/prefer-default-export
export { getRatingStatus };
