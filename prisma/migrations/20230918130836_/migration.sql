/*
  Warnings:

  - You are about to drop the `_CategoryToProduct` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CategoryToSubcategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProductToSubcategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_CategoryToProduct";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_CategoryToSubcategory";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_ProductToSubcategory";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "ProductCategorySubcategory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "subcategoryId" INTEGER NOT NULL,
    CONSTRAINT "ProductCategorySubcategory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProductCategorySubcategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProductCategorySubcategory_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "Subcategory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "ProductCategorySubcategory_productId_idx" ON "ProductCategorySubcategory"("productId");

-- CreateIndex
CREATE INDEX "ProductCategorySubcategory_categoryId_idx" ON "ProductCategorySubcategory"("categoryId");

-- CreateIndex
CREATE INDEX "ProductCategorySubcategory_subcategoryId_idx" ON "ProductCategorySubcategory"("subcategoryId");
