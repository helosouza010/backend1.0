-- CreateTable
CREATE TABLE `Professor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `criadoEm` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `atualizadoEm` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `Professor_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Disciplina` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `cursoId` INTEGER NOT NULL,
    `criadoEm` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `atualizadoEm` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Turma` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `cursoId` INTEGER NOT NULL,
    `professorId` INTEGER NOT NULL,
    `disciplinaId` INTEGER NULL,
    `criadoEm` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `atualizadoEm` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AlunoTurma` (
    `alunoId` INTEGER NOT NULL,
    `turmaId` INTEGER NOT NULL,

    PRIMARY KEY (`alunoId`, `turmaId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProfessorDisciplina` (
    `professorId` INTEGER NOT NULL,
    `disciplinaId` INTEGER NOT NULL,

    PRIMARY KEY (`professorId`, `disciplinaId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Disciplina` ADD CONSTRAINT `Disciplina_cursoId_fkey` FOREIGN KEY (`cursoId`) REFERENCES `Curso`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Turma` ADD CONSTRAINT `Turma_cursoId_fkey` FOREIGN KEY (`cursoId`) REFERENCES `Curso`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Turma` ADD CONSTRAINT `Turma_professorId_fkey` FOREIGN KEY (`professorId`) REFERENCES `Professor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Turma` ADD CONSTRAINT `Turma_disciplinaId_fkey` FOREIGN KEY (`disciplinaId`) REFERENCES `Disciplina`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AlunoTurma` ADD CONSTRAINT `AlunoTurma_alunoId_fkey` FOREIGN KEY (`alunoId`) REFERENCES `Aluno`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AlunoTurma` ADD CONSTRAINT `AlunoTurma_turmaId_fkey` FOREIGN KEY (`turmaId`) REFERENCES `Turma`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProfessorDisciplina` ADD CONSTRAINT `ProfessorDisciplina_professorId_fkey` FOREIGN KEY (`professorId`) REFERENCES `Professor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProfessorDisciplina` ADD CONSTRAINT `ProfessorDisciplina_disciplinaId_fkey` FOREIGN KEY (`disciplinaId`) REFERENCES `Disciplina`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
