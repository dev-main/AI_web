-- CreateTable
CREATE TABLE "FocusSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "appName" TEXT NOT NULL,
    "windowTitle" TEXT,
    "startTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" DATETIME,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TrackerState" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "lastPingTime" DATETIME,
    "currentAppName" TEXT,
    "currentSessionId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "FocusSession_appName_idx" ON "FocusSession"("appName");

-- CreateIndex
CREATE INDEX "FocusSession_startTime_idx" ON "FocusSession"("startTime");
