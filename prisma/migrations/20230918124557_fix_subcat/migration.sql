/*
  Warnings:

  - You are about to drop the column `subcategoryId` on the `Product` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "_ProductToSubcategory" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ProductToSubcategory_A_fkey" FOREIGN KEY ("A") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ProductToSubcategory_B_fkey" FOREIGN KEY ("B") REFERENCES "Subcategory" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_CategoryToSubcategory" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_CategoryToSubcategory_A_fkey" FOREIGN KEY ("A") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CategoryToSubcategory_B_fkey" FOREIGN KEY ("B") REFERENCES "Subcategory" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "subcategoryId" INTEGER
);
INSERT INTO "new_Category" ("description", "id", "subcategoryId", "title") SELECT "description", "id", "subcategoryId", "title" FROM "Category";
DROP TABLE "Category";
ALTER TABLE "new_Category" RENAME TO "Category";
CREATE TABLE "new_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "isNew" BOOLEAN NOT NULL DEFAULT false,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_Product" ("description", "id", "isAvailable", "isNew", "price", "shortDescription", "title") SELECT "description", "id", "isAvailable", "isNew", "price", "shortDescription", "title" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToSubcategory_AB_unique" ON "_ProductToSubcategory"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToSubcategory_B_index" ON "_ProductToSubcategory"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToSubcategory_AB_unique" ON "_CategoryToSubcategory"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToSubcategory_B_index" ON "_CategoryToSubcategory"("B");
