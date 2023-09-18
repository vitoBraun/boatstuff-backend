/*
  Warnings:

  - You are about to drop the `ProductCategorySubcategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subcategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `description` on the `Category` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "ProductCategorySubcategory_subcategoryId_idx";

-- DropIndex
DROP INDEX "ProductCategorySubcategory_categoryId_idx";

-- DropIndex
DROP INDEX "ProductCategorySubcategory_productId_idx";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ProductCategorySubcategory";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Subcategory";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "CategorySubcategory" (
    "successorId" INTEGER NOT NULL,
    "predecessorId" INTEGER NOT NULL,

    PRIMARY KEY ("successorId", "predecessorId"),
    CONSTRAINT "CategorySubcategory_successorId_fkey" FOREIGN KEY ("successorId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CategorySubcategory_predecessorId_fkey" FOREIGN KEY ("predecessorId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_CategoryToProduct" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_CategoryToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CategoryToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "descriptions" TEXT
);
INSERT INTO "new_Category" ("id", "title") SELECT "id", "title" FROM "Category";
DROP TABLE "Category";
ALTER TABLE "new_Category" RENAME TO "Category";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToProduct_AB_unique" ON "_CategoryToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToProduct_B_index" ON "_CategoryToProduct"("B");
