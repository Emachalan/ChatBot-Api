const { client } = require('../db/connection');

module.exports.createUser = async function (params, callback) {
    const { name, email, password, phone_number, profile_url } = params;

    client.query(
        "INSERT INTO users (name, email, password, phone_number, profile_url, created_at, updated_at, last_seen) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, name, email, password, phone_number, profile_url, created_at, last_seen",
        [name, email, password, phone_number, profile_url, new Date(), new Date(), new Date()],
        (error, result) => {
            console.log('user create', error, result)
            if (error) {
                callback(error, null);
            } else {
                callback(error, result.rows[0]);
            }
            // client.end();
        }
    );
};

module.exports.getUsers = async function (params, callback) {
    client.query("SELECT * FROM users", (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result.rows);
        }
    })
};

module.exports.getUser = async function (params, callback) {
    const { id } = params;

    client.query("SELECT * FROM users WHERE id = $1", [id], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result.rows[0]);
        }
    })
};

module.exports.updateUser = async function (params, callback) {
    const { name, email, password, phone_number, profile_url, id } = params;

    client.query(
        "UPDATE users SET name = $2, profile_url = $3, updated_at = $4, last_seen = $5  WHERE id = $1 RETURNING id, name, email, password, phone_number, profile_url, last_seen",
        [id, name, profile_url, new Date(), new Date ],
        (error, result) => {
            console.log('post update', error, result)
            if (error) {
                callback(error, null);
            } else {
                callback(error, result.rows[0]);
            }
            // client.end();
        }
    );
};

module.exports.updateLastseen = async function (params, callback) {
    const { id } = params;

    client.query(
        "UPDATE users SET last_seen = $2  WHERE id = $1 RETURNING id, name, email, password, phone_number, profile_url, last_seen",
        [id, new Date],
        (error, result) => {
            console.log('lastseen update', error, result)
            if (error) {
                callback(error, null);
            } else {
                callback(error, result.rows[0]);
            }
            // client.end();
        }
    );
};