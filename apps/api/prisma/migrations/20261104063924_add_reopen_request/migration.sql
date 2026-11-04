-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "reopenRequestMessage" TEXT,
ADD COLUMN     "reopenRequestedAt" TIMESTAMP(3);
