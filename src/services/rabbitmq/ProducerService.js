'use strict';

const amqp = require('amqplib');
const InvariantError = require('../../exeptions/InvariantError');

class ProducerService {
    constructor() {
        this._openConnection = null;
        this._channel = null;
        this._server = process.env.RABBITMQ_SERVER;
    }

    async _getChannel() {
        if (!this._server) {
            throw new InvariantError('RABBITMQ_SERVER is not defined');
        }

        if (this._channel) {
            return this._channel;
        }

        if (!this._openConnection) {
            this._openConnection = await amqp.connect(this._server);
        }

        this._channel = await this._openConnection.createChannel();
        return this._channel;
    }

    async sendMessage(queue, message) {
        const channel = await this._getChannel();
        await channel.assertQueue(queue, {
            durable: true,
        });

        const success = channel.sendToQueue(queue, Buffer.from(message));
        if (!success) {
            throw new InvariantError('Failed to send message');
        }
    }
}

module.exports = ProducerService;
