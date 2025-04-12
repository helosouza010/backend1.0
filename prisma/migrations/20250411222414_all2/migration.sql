/*
  Warnings:

  - You are about to drop the column `datacriacao` on the `aluno` table. All the data in the column will be lost.
  - You are about to drop the column `datatualizacao` on the `aluno` table. All the data in the column will be lost.
  - You are about to drop the column `senha` on the `aluno` table. All the data in the column will be lost.
  - You are about to drop the column `datacriacao` on the `curso` table. All the data in the column will be lost.
  - You are about to drop the column `datatualizacao` on the `curso` table. All the data in the column will be lost.
  - You are about to drop the column `Cnpj` on the `universidade` table. All the data in the column will be lost.
  - You are about to drop the column `datacriacao` on the `universidade` table. All the data in the column will be lost.
  - You are about to drop the column `datatualizacao` on the `universidade` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cnpj]` on the table `Universidade` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `atualizadoEm` to the `Aluno` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cursoId` to the `Aluno` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senhaHash` to the `Aluno` table without a default value. This is not possible if the table is not empty.
  - Added the required column `atualizadoEm` to the `Curso` table without a default value. This is not possible if the table is not empty.
  - Added the required column `universidadeId` to the `Curso` table without a default value. This is not possible if the table is not empty.
  - Added the required column `atualizadoEm` to the `Universidade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cnpj` to the `Universidade` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `aluno` DROP COLUMN `datacriacao`,
    DROP COLUMN `datatualizacao`,
    DROP COLUMN `senha`,
    ADD COLUMN `atualizadoEm` TIMESTAMP(0) NOT NULL,
    ADD COLUMN `criadoEm` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD COLUMN `cursoId` INTEGER NOT NULL,
    ADD COLUMN `senhaHash` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `curso` DROP COLUMN `datacriacao`,
    DROP COLUMN `datatualizacao`,
    ADD COLUMN `atualizadoEm` TIMESTAMP(0) NOT NULL,
    ADD COLUMN `criadoEm` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD COLUMN `universidadeId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `universidade` DROP COLUMN `Cnpj`,
    DROP COLUMN `datacriacao`,
    DROP COLUMN `datatualizacao`,
    ADD COLUMN `atualizadoEm` TIMESTAMP(0) NOT NULL,
    ADD COLUMN `cnpj` VARCHAR(18) NOT NULL,
    ADD COLUMN `criadoEm` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);

-- CreateIndex
CREATE UNIQUE INDEX `Universidade_cnpj_key` ON `Universidade`(`cnpj`);

-- AddForeignKey
ALTER TABLE `Aluno` ADD CONSTRAINT `Aluno_cursoId_fkey` FOREIGN KEY (`cursoId`) REFERENCES `Curso`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Curso` ADD CONSTRAINT `Curso_universidadeId_fkey` FOREIGN KEY (`universidadeId`) REFERENCES `Universidade`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `aluno` RENAME INDEX `aluno_email_key` TO `Aluno_email_key`;

-- RenameIndex
ALTER TABLE `curso` RENAME INDEX `curso_nome_key` TO `Curso_nome_key`;
