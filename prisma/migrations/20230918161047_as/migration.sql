-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "level" INTEGER DEFAULT 1
);
INSERT INTO "new_Category" ("description", "id", "level", "title") SELECT "description", "id", "level", "title" FROM "Category";
DROP TABLE "Category";
ALTER TABLE "new_Category" RENAME TO "Category";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
