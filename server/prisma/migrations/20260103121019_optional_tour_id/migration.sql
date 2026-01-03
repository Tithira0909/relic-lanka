-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Destination" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tourId" TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "mapImageUrl" TEXT,
    "routeImageUrl" TEXT,
    "routeText" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Destination_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Destination" ("description", "id", "mapImageUrl", "name", "routeImageUrl", "routeText", "slug", "sortOrder", "tourId") SELECT "description", "id", "mapImageUrl", "name", "routeImageUrl", "routeText", "slug", "sortOrder", "tourId" FROM "Destination";
DROP TABLE "Destination";
ALTER TABLE "new_Destination" RENAME TO "Destination";
CREATE INDEX "Destination_tourId_idx" ON "Destination"("tourId");
CREATE TABLE "new_Experience" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tourId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "adventureItems" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Experience_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Experience" ("adventureItems", "description", "id", "sortOrder", "title", "tourId") SELECT "adventureItems", "description", "id", "sortOrder", "title", "tourId" FROM "Experience";
DROP TABLE "Experience";
ALTER TABLE "new_Experience" RENAME TO "Experience";
CREATE INDEX "Experience_tourId_idx" ON "Experience"("tourId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
