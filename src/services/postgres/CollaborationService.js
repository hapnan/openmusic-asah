const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exeptions/InvariantError');
const NotFoundError = require('../../exeptions/NotFoundError');
const AutorizationError = require('../../exeptions/AutorizationError');

class CollaborationService {
    constructor() {
        this._pool = new Pool();
    }

    async addCollaboration(playlistId, userId) {
        // First, verify that the user exists
        const userQuery = {
            text: 'SELECT id FROM users WHERE id = $1',
            values: [userId],
        };

        const userResult = await this._pool.query(userQuery);
        if (!userResult.rows.length) {
            throw new NotFoundError('User tidak ditemukan');
        }

        // Then add the collaboration
        const id = `collab-${nanoid()}`;
        const query = {
            text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
            values: [id, playlistId, userId],
        };

        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new InvariantError('Kolaborasi gagal ditambahkan');
        }
        return result.rows[0].id;
    }

    async deleteCollaboration(playlistId, userId) {
        // First, verify that the user exists
        const userQuery = {
            text: 'SELECT id FROM users WHERE id = $1',
            values: [userId],
        };

        const userResult = await this._pool.query(userQuery);
        if (!userResult.rows.length) {
            throw new NotFoundError('User tidak ditemukan');
        }

        // Then try to delete the collaboration
        const query = {
            text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING id',
            values: [playlistId, userId],
        };

        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Kolaborasi tidak ditemukan');
        }
        return result.rows[0].id;
    }

    async verifyCollaborator(playlistId, userId) {
        const query = {
            text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
            values: [playlistId, userId],
        };
        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new AutorizationError('Anda tidak berhak mengakses resource ini');
        }
    }
}

module.exports = CollaborationService;
