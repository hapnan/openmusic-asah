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
    'activities',
    {
      id: {
        type: 'VARCHAR(50)',
        primaryKey: true,
      },
      playlist_id: {
        type: 'VARCHAR(50)',
        notNull: true,
        references: '"playlists"',
        onDelete: 'CASCADE',
      },
      song_id: {
        type: 'VARCHAR(50)',
        notNull: true,
        references: '"songs"',
        onDelete: 'CASCADE',
      },
      user_id: {
        type: 'VARCHAR(50)',
        notNull: true,
        references: '"users"',
        onDelete: 'CASCADE',
      },
      action: {
        type: 'VARCHAR(10)',
        notNull: true,
      },
      time: {
        type: 'TIMESTAMP',
        notNull: true,
      },
    },
    {
      ifNotExists: true,
    }
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('activities');
};
