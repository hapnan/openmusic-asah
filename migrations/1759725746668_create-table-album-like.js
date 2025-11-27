/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.createTable(
        'albums_likes',
        {
            id: {
                type: 'VARCHAR(50)',
                primaryKey: true,
            },
            album_id: {
                type: 'VARCHAR(50)',
                notNull: true,
                references: '"albums"',
                onDelete: 'CASCADE',
            },
            user_id: {
                type: 'VARCHAR(50)',
                notNull: true,
                references: '"users"',
                onDelete: 'CASCADE',
            },
            is_liked: {
                type: 'BOOLEAN',
                notNull: true,
            },
            created_at: {
                type: 'TIMESTAMP',
                notNull: true,
                default: pgm.func('CURRENT_TIMESTAMP'),
            },
        },
        {
            ifNotExists: true,
        }
    );

    pgm.createIndex('albums_likes', 'album_id');
    pgm.addConstraint(
        'albums_likes',
        'fk_albums_likes.album_id_albums.id',
        'FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE'
    );
    pgm.addConstraint(
        'albums_likes',
        'fk_albums_likes.user_id_users.id',
        'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE'
    );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('albums_likes');
};
