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
  pgm.sql("DROP TABLE IF EXISTS songs CASCADE");

  pgm.createTable("albums", {
    id: { type: "VARCHAR(50)", primaryKey: true },
    name: { type: "TEXT", notNull: true },
    year: { type: "INTEGER", notNull: true },
  });

  pgm.createTable("songs", {
    id: { type: "VARCHAR(50)", primaryKey: true },
    title: { type: "TEXT", notNull: true },
    year: { type: "INTEGER", notNull: true },
    performer: { type: "TEXT", notNull: true },
    genre: { type: "TEXT" },
    duration: { type: "INTEGER" },
    albumsid: {
      type: "VARCHAR(50)",
      references: "albums(id)",
      onDelete: "CASCADE",
    },
  });

  pgm.addConstraint(
    "songs",
    "fk_songs.albumsid_albums.id",
    "FOREIGN KEY(albumsid) REFERENCES albums(id) ON DELETE CASCADE"
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("songs");
  pgm.dropTable("albums");
};
