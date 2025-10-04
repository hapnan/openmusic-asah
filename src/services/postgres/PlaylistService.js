'use strict';

const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exeptions/InvariantError');
const NotFoundError = require('../../exeptions/NotFoundError');
const AuthorizationError = require('../../exeptions/AutorizationError');

class PlaylistService {
    constructor() {
        this._pool = new Pool();
    }

    async addPlaylist({ name, owner }) {
        const id = `playlist-${nanoid()}`;
        const query = {
            text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
            values: [id, name, owner],
        };

        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new InvariantError('Playlist gagal ditambahkan');
        }
        return result.rows[0].id;
    }

    async addSongToPlaylist(playlistId, songId, userId) {
        // Add userId parameter
        // First, verify that the song exists
        const songQuery = {
            text: 'SELECT id FROM songs WHERE id = $1',
            values: [songId],
        };

        const songResult = await this._pool.query(songQuery);
        if (!songResult.rows.length) {
            throw new NotFoundError('Song tidak ditemukan');
        }

        // Then add the song to the playlist
        const id = `playlistsong-${nanoid()}`;
        const query = {
            text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
            values: [id, playlistId, songId],
        };

        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new InvariantError('Lagu gagal ditambahkan ke playlist');
        }

        // Log the activity with the actual user who performed the action
        const activityId = `activity-${nanoid()}`;
        const time = new Date().toISOString();
        const activityQuery = {
            text: 'INSERT INTO activities (id, playlist_id, song_id, user_id, action, time) VALUES($1, $2, $3, $4, $5, $6)',
            values: [activityId, playlistId, songId, userId, 'add', time], // Use userId instead of playlist owner
        };
        await this._pool.query(activityQuery);

        return result.rows[0].id;
    }

    async getPlaylists(userId) {
        const query = {
            text: `SELECT DISTINCT p.id, p.name, u.username
                   FROM playlists p
                   JOIN users u ON p.owner = u.id
                   LEFT JOIN collaborations c ON p.id = c.playlist_id
                   WHERE p.owner = $1 OR c.user_id = $1`,
            values: [userId],
        };

        const result = await this._pool.query(query);

        return result.rows;
    }

    async getPlaylistWithSongs(id) {
        const query = {
            text: `SELECT p.id, p.name, u.username,
                    jsonb_agg(
                        jsonb_build_object(
                            'id', s.id,
                            'title', s.title,
                            'performer', s.performer
                        )
                    ) AS songs FROM playlists p
                    JOIN users u ON p.owner = u.id
                    LEFT JOIN playlist_songs ps ON p.id = ps.playlist_id
                    LEFT JOIN songs s ON ps.song_id = s.id
                    WHERE p.id = $1
                    GROUP BY p.id, u.username;`,
            values: [id],
        };

        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Playlist tidak ditemukan');
        }

        return result.rows[0];
    }

    async deletePlaylistById(id) {
        const query = {
            text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
            values: [id],
        };

        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Playlist tidak ditemukan');
        }
    }

    async deleteSongFromPlaylist(playlistId, songId, userId) {
        // Add userId parameter
        const songQuery = {
            text: 'SELECT id FROM songs WHERE id = $1',
            values: [songId],
        };

        const songResult = await this._pool.query(songQuery);
        if (!songResult.rows.length) {
            throw new NotFoundError('Song tidak ditemukan');
        }

        // Then try to delete it from the playlist
        const query = {
            text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
            values: [playlistId, songId],
        };

        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Lagu tidak ditemukan di playlist');
        }

        // Log the activity with the actual user who performed the action
        const activityId = `activity-${nanoid()}`;
        const time = new Date().toISOString();
        const activityQuery = {
            text: 'INSERT INTO activities (id, playlist_id, song_id, user_id, action, time) VALUES($1, $2, $3, $4, $5, $6)',
            values: [activityId, playlistId, songId, userId, 'delete', time], // Use userId instead of playlist owner
        };
        await this._pool.query(activityQuery);
    }

    async verifyPlaylistOwner(playlistId, owner) {
        const query = {
            text: 'SELECT owner FROM playlists WHERE id = $1',
            values: [playlistId],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Playlist tidak ditemukan');
        }

        const playlist = result.rows[0];

        if (playlist.owner !== owner) {
            throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
        }
    }

    async verifyPlaylistAccess(playlistId, userId) {
        try {
            await this.verifyPlaylistOwner(playlistId, userId);
        } catch (error) {
            if (error instanceof AuthorizationError) {
                const query = {
                    text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
                    values: [playlistId, userId],
                };
                const result = await this._pool.query(query);

                if (!result.rows.length) {
                    throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
                }
            } else if (error instanceof NotFoundError) {
                throw error; // Re-throw NotFoundError
            }
            // If not the owner, check for collaboration
        }
    }

    async getActivities(playlistId) {
        const query = {
            text: `SELECT p.id AS "playlistId", 
                   jsonb_agg(
                       jsonb_build_object(
                           'username', u.username,
                           'title', s.title,
                           'action', a.action,
                           'time', a.time
                       ) ORDER BY a.time ASC
                   ) AS activities
                   FROM playlists p
                   JOIN activities a ON p.id = a.playlist_id
                   JOIN songs s ON a.song_id = s.id
                   JOIN users u ON a.user_id = u.id
                   WHERE p.id = $1
                   GROUP BY p.id`,
            values: [playlistId],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Activity tidak ditemukan');
        }

        return result.rows[0]; // Return single object, not array
    }
}
module.exports = PlaylistService;
