-- CreateTable
CREATE TABLE `Endereco` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `logradouro` VARCHAR(255) NOT NULL,
    `numero` VARCHAR(10) NOT NULL,
    `complemento` VARCHAR(255) NULL,
    `bairro` VARCHAR(255) NOT NULL,
    `cidade` VARCHAR(255) NOT NULL,
    `estado` VARCHAR(2) NOT NULL,
    `cep` VARCHAR(20) NOT NULL,
    `pais` VARCHAR(100) NOT NULL DEFAULT 'Brasil',
    `dataCriacao` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `dataAtualizacao` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
