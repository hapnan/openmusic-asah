'use strict';

const jwt = require('@hapi/jwt');
const InvariantError = require('../exeptions/InvariantError');

const TokenManager = {
  generateAccessToken: (payload) => {
    return jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY);
  },
  generateRefreshToken: (payload) => {
    return jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY);
  },
  getUserIdFromToken: (token) => {
    try {
      const artifacts = jwt.token.decode(token);
      return artifacts.decoded.payload.id;
    }
    catch (error) {
      throw new InvariantError('Invalid token');
    }
  },
  verifyRefreshToken: (refreshToken) => {
    try {
      const artifacts = jwt.token.decode(refreshToken);
      jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY);
      const { payload } = artifacts.decoded;
      return payload;
    }
    catch (error) {
      throw new InvariantError('Refresh token tidak valid');
    }
  }
};

module.exports = TokenManager;
