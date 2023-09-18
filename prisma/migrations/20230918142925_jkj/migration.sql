/*
  Warnings:

  - The primary key for the `CategorySubcategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `successorId` on the `CategorySubcategory` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CategorySubcategory" (
    "predecessorId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    CONSTRAINT "CategorySubcategory_predecessorId_fkey" FOREIGN KEY ("predecessorId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CategorySubcategory" ("predecessorId") SELECT "predecessorId" FROM "CategorySubcategory";
DROP TABLE "CategorySubcategory";
ALTER TABLE "new_CategorySubcategory" RENAME TO "CategorySubcategory";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
