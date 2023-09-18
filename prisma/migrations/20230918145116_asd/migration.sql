/*
  Warnings:

  - You are about to drop the `CategorySubcategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CategorySubcategory";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "_CategoriesToCategories" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_CategoriesToCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CategoriesToCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_CategoriesToCategories_AB_unique" ON "_CategoriesToCategories"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoriesToCategories_B_index" ON "_CategoriesToCategories"("B");
