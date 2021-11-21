require("dotenv").config();
const Pool = require("pg").Pool;

const isProduction = process.env.NODE_ENV === "production";
const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

const client = new Pool({
    connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
    ssl: isProduction ? { rejectUnauthorized: false } : false
});

client.connect();

const create_user_query = `
    CREATE TABLE IF NOT EXISTS users (
        id serial PRIMARY KEY,
        name varchar,
        email varchar UNIQUE,
        password varchar,
        phone_number bigint UNIQUE,
        profile_url varchar,
        created_at timestamp,
        updated_at timestamp,
        last_seen timestamp
    );
`;

const create_messages_query = `
    CREATE TABLE IF NOT EXISTS messages (
        id serial PRIMARY KEY,
        from_id int,
        to_id int,
        text varchar,
        created_at timestamp,
        updated_at timestamp,
        is_deleted boolean DEFAULT false,
        is_updated boolean DEFAULT false,
        is_delivered boolean,
        delivered_at timestamp,
        is_read boolean,
        image_url varchar,
        video_url varchar,
        sticker_url varchar,
        FOREIGN KEY(from_id) REFERENCES users(id),
        FOREIGN KEY(to_id) REFERENCES users(id)
    );
`;


const create_blocklist_query = `
    CREATE TABLE IF NOT EXISTS users_blocklist (
        id serial PRIMARY KEY,
        from_id int,
        to_id int,
        created_at timestamp,
        FOREIGN KEY(from_id) REFERENCES users(id),
        FOREIGN KEY(to_id) REFERENCES users(id)
    );
`;

client
    .query(create_user_query)
    .then(result => {
        console.log('user table created successfully'),
            client
                .query(create_blocklist_query)
                .then(result => console.log('block table created successfully'),
                    client
                        .query(create_messages_query)
                        .then(result => console.log('messages table created successfully'))
                        .catch(e => console.error('post messages connection error', e.stack)))
            .catch(e => console.error('post block connection error', e.stack))

    }
    )
    .catch(e => console.error('user db connection error', e.stack));

module.exports = {
    client
};