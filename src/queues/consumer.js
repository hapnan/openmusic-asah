'use strict';

require('dotenv').config();

const amqp = require('amqplib');
const PlaylistService = require('../services/postgres/PlaylistService');
const MailSender = require('../services/mail/MailSender');

const init = async () => {
    const server = process.env.RABBITMQ_SERVER;
    if (!server) {
        throw new Error('RABBITMQ_SERVER is not defined');
    }

    const playlistService = new PlaylistService();
    const mailSender = new MailSender();
    const queue = 'export:playlists';

    const connection = await amqp.connect(server);
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: true });

    channel.consume(queue, async (message) => {
        if (!message) {
            return;
        }

        try {
            const { playlistId, targetEmail } = JSON.parse(message.content.toString());
            const playlist = await playlistService.getPlaylistWithSongs(playlistId);

            const exportPayload = {
                playlist: {
                    id: playlist.id,
                    name: playlist.name,
                    songs: playlist.songs || [],
                },
            };

            await mailSender.sendEmail(targetEmail, JSON.stringify(exportPayload, null, 2));
            channel.ack(message);
        } catch (error) {
            console.error('Failed processing message', error);
            channel.nack(message, false, false);
        }
    });

    console.log('Consumer listening on queue:', queue);
};

init();
