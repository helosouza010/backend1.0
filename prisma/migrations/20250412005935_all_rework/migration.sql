/*
  Warnings:

  - A unique constraint covering the columns `[alunoId]` on the table `Endereco` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tipo` to the `Endereco` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `endereco` ADD COLUMN `alunoId` INTEGER NULL,
    ADD COLUMN `tipo` ENUM('COMERCIAL', 'RESIDENCIAL') NOT NULL,
    ADD COLUMN `universidadeId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Endereco_alunoId_key` ON `Endereco`(`alunoId`);

-- AddForeignKey
ALTER TABLE `Endereco` ADD CONSTRAINT `Endereco_universidadeId_fkey` FOREIGN KEY (`universidadeId`) REFERENCES `Universidade`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Endereco` ADD CONSTRAINT `Endereco_alunoId_fkey` FOREIGN KEY (`alunoId`) REFERENCES `Aluno`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
