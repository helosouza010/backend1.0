-- CreateTable
CREATE TABLE `Permissao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(50) NOT NULL,
    `criadoEm` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `atualizadoEm` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `Permissao_nome_key`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AlunoPermissao` (
    `alunoId` INTEGER NOT NULL,
    `permissaoId` INTEGER NOT NULL,

    PRIMARY KEY (`alunoId`, `permissaoId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AlunoPermissao` ADD CONSTRAINT `AlunoPermissao_alunoId_fkey` FOREIGN KEY (`alunoId`) REFERENCES `Aluno`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AlunoPermissao` ADD CONSTRAINT `AlunoPermissao_permissaoId_fkey` FOREIGN KEY (`permissaoId`) REFERENCES `Permissao`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
