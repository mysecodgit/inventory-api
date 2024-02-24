/*
  Warnings:

  - Added the required column `total` to the `Sale` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `sale` ADD COLUMN `discount` DOUBLE NULL,
    ADD COLUMN `total` DOUBLE NOT NULL;
