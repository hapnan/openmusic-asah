const { Pool } = require('pg');
const InvariantError = require('../../exeptions/InvariantError');

class AuthService {
    constructor() {
        this._pool = new Pool();
    }

    async addRefreshToken(token) {
        const query = {
            text: 'INSERT INTO auth VALUES($1)',
            values: [token],
        };

        await this._pool.query(query);
    }

    async verifyRefreshToken(token) {
        const query = {
            text: 'SELECT token FROM auth WHERE token = $1',
            values: [token],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new InvariantError(
                'Refresh token tidak ditemukan di database'
            );
        }
    }

    async deleteRefreshToken(token) {
        const query = {
            text: 'DELETE FROM auth WHERE token = $1',
            values: [token],
        };

        const result = await this._pool.query(query);

        if (result.rowCount === 0) {
            throw new InvariantError(
                'Refresh token gagal dihapus. Token tidak ditemukan di database'
            );
        }
    }
}

module.exports = AuthService;
