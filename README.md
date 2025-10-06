# OpenMusic API

## Export Playlist Feature

This project now supports exporting playlists via RabbitMQ and email delivery.

### Environment Variables

Make sure these variables are defined in your `.env` file:

-   `RABBITMQ_SERVER` &ndash; URI of the RabbitMQ server (for example, `amqp://localhost`).
-   `SMTP_HOST` &ndash; SMTP server host name.
-   `SMTP_PORT` &ndash; SMTP server port (number).
-   `SMTP_USER` &ndash; SMTP username (also used as the email sender address).
-   `SMTP_PASSWORD` &ndash; SMTP password.

All existing variables that power authentication, PostgreSQL, and JWT must remain configured.

### Running the Services

1. Start the API server:

    ```bash
    npm run start:dev
    ```

2. Start the export consumer (in a separate terminal):

    ```bash
    npm run start:consumer
    ```

### Export Endpoint

Send a POST request to `/export/playlists/{playlistId}` with the JSON body:

```json
{
    "targetEmail": "user@example.com"
}
```

Only playlist owners can request an export. The request responds immediately with a 201 status while the export is processed asynchronously.

### Email Output

The consumer gathers playlist data, builds a JSON payload in the following structure, and emails it as an attachment:

```json
{
    "playlist": {
        "id": "playlist-Mk8AnmCp210PwT6B",
        "name": "My Favorite Coldplay Song",
        "songs": [
            {
                "id": "song-Qbax5Oy7L8WKf74l",
                "title": "Life in Technicolor",
                "performer": "Coldplay"
            }
        ]
    }
}
```

Adjust SMTP credentials and RabbitMQ routing as needed for your environment.
