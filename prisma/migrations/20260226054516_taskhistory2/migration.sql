-- CreateTable
CREATE TABLE "TaskHistory" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "TaskHistory_pkey" PRIMARY KEY ("id")
);
