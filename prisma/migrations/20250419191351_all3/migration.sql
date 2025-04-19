/*
  Warnings:

  - A unique constraint covering the columns `[professorId]` on the table `Endereco` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `endereco` ADD COLUMN `professorId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Endereco_professorId_key` ON `Endereco`(`professorId`);

-- AddForeignKey
ALTER TABLE `Endereco` ADD CONSTRAINT `Endereco_professorId_fkey` FOREIGN KEY (`professorId`) REFERENCES `Professor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
