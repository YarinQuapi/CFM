CREATE TABLE `servers`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `host` VARCHAR(255) NOT NULL,
    `status` INT NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME NOT NULL
);
CREATE TABLE `users`(
    `id` CHAR(36) NOT NULL DEFAULT 'UUID()',
    `first_name` VARCHAR(255) NOT NULL,
    `last_name` VARCHAR(255) NOT NULL,
    `display_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `token` VARCHAR(255) NOT NULL,
    `last_login` DATETIME NULL,
    `role` INT NOT NULL,
    `isActive` INT NOT NULL,
    `createdAt` DATETIME NOT NULL,
    PRIMARY KEY(`id`)
);
ALTER TABLE
    `users` ADD UNIQUE `users_email_unique`(`email`);
CREATE TABLE `serverAccess`(
    `id` CHAR(36) NOT NULL,
    `user` CHAR(36) NOT NULL,
    `server` CHAR(36) NOT NULL,
    `createdAt` DATETIME NOT NULL,
    PRIMARY KEY(`id`)
);
CREATE TABLE `editTracker`(
    `id` CHAR(36) NOT NULL,
    `user` CHAR(36) NOT NULL,
    `action` VARCHAR(255) NOT NULL,
    `oldValue` VARCHAR(255) NULL,
    `newVaule` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME NOT NULL,
    PRIMARY KEY(`id`)
);
CREATE TABLE `files`(
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `path` VARCHAR(255) NOT NULL,
    `uploader` CHAR(36) NOT NULL,
    `createdAt` DATETIME NOT NULL,
    PRIMARY KEY(`id`)
);
CREATE TABLE `fileAccess`(
    `id` CHAR(36) NOT NULL,
    `file` CHAR(36) NOT NULL,
    `server` CHAR(36) NOT NULL,
    `authorizer` CHAR(36) NOT NULL,
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