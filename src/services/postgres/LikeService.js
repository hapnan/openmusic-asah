'use strict';

const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exeptions/InvariantError');
const NotFoundError = require('../../exeptions/NotFoundError');

class LikeService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addLike(userId, albumId) {
    const id = `like-${nanoid()}`;
    const query = {
      text: 'INSERT INTO albums_likes (id, userId, albumId, isLiked) VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, userId, albumId, true]
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Like gagal ditambahkan');
    }

    // Delete cache when a like is added
    await this._cacheService.delete(`album:${albumId}:likes`);

    return result.rows[0].id;
  }

  async removeLike(userId, albumId) {
    const query = {
      text: 'DELETE FROM albums_likes WHERE userId = $1 AND albumId = $2 RETURNING id',
      values: [userId, albumId]
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Like gagal dihapus. Like tidak ditemukan');
    }

    // Delete cache when a like is removed
    await this._cacheService.delete(`album:${albumId}:likes`);

    return result.rows[0].id;
  }

  async getLikesCount(albumId) {
    try {
      // Try to get from cache
      const result = await this._cacheService.get(`album:${albumId}:likes`);
      return {
        count: parseInt(result, 10),
        source: 'cache'
      };
    }
    catch (error) {
      // If not in cache, get from database
      const query = {
        text: 'SELECT COUNT(id) AS likes FROM albums_likes WHERE albumId = $1',
        values: [albumId]
      };

      const result = await this._pool.query(query);

      if (!result.rows.length) {
        throw new NotFoundError('Album tidak ditemukan');
      }

      const count = parseInt(result.rows[0].likes, 10);

      // Store in cache for 30 minutes (1800 seconds)
      await this._cacheService.set(`album:${albumId}:likes`, count, 1800);

      return {
        count,
        source: 'database'
      };
    }
  }

  async isAlbumLikedByUser(userId, albumId) {
    const query = {
      text: 'SELECT id FROM albums_likes WHERE userId = $1 AND albumId = $2',
      values: [userId, albumId]
    };

    const result = await this._pool.query(query);

    if (result.rows.length > 0) {
      throw new InvariantError('Kamu sudah menyukai album ini');
    }
  }
}

module.exports = LikeService;
