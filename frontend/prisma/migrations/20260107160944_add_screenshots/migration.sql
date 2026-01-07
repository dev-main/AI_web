-- AlterTable
ALTER TABLE "FocusSession" ADD COLUMN "screenshotPath" TEXT;

-- CreateIndex
CREATE INDEX "FocusSession_createdAt_idx" ON "FocusSession"("createdAt");
