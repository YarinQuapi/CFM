CREATE TABLE `servers`(
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `host` VARCHAR(255) NOT NULL,
    `status` INT NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME NOT NULL
);
CREATE table `users`(
    `id` VARCHAR(36) NOT null primary key,
    `firstName` VARCHAR(255) NOT NULL,
    `lastName` VARCHAR(255) NOT NULL,
    `displayName` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `token` VARCHAR(255) NOT NULL,
    `lastLogin` DATETIME NULL,
    `role` INT NOT NULL,
    `isActive` INT NOT NULL,
    `createdAt` DATETIME NOT NULL
);
CREATE TABLE `serverAccess`(
    `id` VARCHAR(36) NOT NULL,
    `user` VARCHAR(36) NOT NULL,
    `server` VARCHAR(36) NOT NULL,
    `createdAt` DATETIME NOT NULL,
    PRIMARY KEY(`id`)
);
CREATE TABLE `editTracker`(
    `id` VARCHAR(36) NOT NULL,
    `user` VARCHAR(36) NOT NULL,
    `action` VARCHAR(255) NOT NULL,
    `oldValue` VARCHAR(255) NULL,
    `newVaule` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME NOT NULL,
    PRIMARY KEY(`id`)
);
CREATE TABLE `files`(
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `path` VARCHAR(255) NOT NULL,
    `uploader` VARCHAR(36) NOT NULL,
    `createdAt` DATETIME NOT NULL,
    PRIMARY KEY(`id`)
);
CREATE TABLE `fileAccess`(
    `id` VARCHAR(36) NOT NULL,
    `file` VARCHAR(36) NOT NULL,
    `server` VARCHAR(36) NOT NULL,
    `authorizer` VARCHAR(36) NOT NULL,
    `createdAt` DATETIME NOT NULL,
    PRIMARY KEY(`id`)
);
ALTER TABLE
    `serverAccess` ADD CONSTRAINT `serveraccess_server_foreign` FOREIGN KEY(`server`) REFERENCES `servers`(`id`);
ALTER TABLE
    `fileAccess` ADD CONSTRAINT `fileaccess_file_foreign` FOREIGN KEY(`file`) REFERENCES `files`(`id`);
ALTER TABLE
    `serverAccess` ADD CONSTRAINT `serveraccess_user_foreign` FOREIGN KEY(`user`) REFERENCES `users`(`id`);
ALTER TABLE
    `fileAccess` ADD CONSTRAINT `fileaccess_server_foreign` FOREIGN KEY(`server`) REFERENCES `servers`(`id`);