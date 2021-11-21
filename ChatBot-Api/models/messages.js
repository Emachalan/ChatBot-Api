const { client } = require('../db/connection');

module.exports.createMessage = async function (params, callback) {
    const { from_id, to_id, text, image_url, video_url, sticker_url } = params;

    client.query(
        "INSERT INTO messages (from_id, to_id, text, image_url, video_url, sticker_url, is_delivered, is_read, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, from_id, to_id, text, image_url, video_url, sticker_url, is_delivered, is_read",
        [from_id, to_id, text, image_url, video_url, sticker_url, false, false, new Date()],
        (error, result) => {
            console.log('message create', error, result)
            if (error) {
                callback(error, null);
            } else {
                callback(error, result.rows[0]);
            }
            // client.end();
        }
    );
};

module.exports.getMessages = async function (params, callback) {
    client.query("SELECT * FROM messages", (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result.rows);
        }
    })
};

module.exports.getUserMessages = async function (params, callback) {
    const { from_id, to_id } = params;

    client.query("SELECT * FROM messages WHERE from_id = $1 AND to_id = $2", [from_id, to_id], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            // callback(null, result.rows);
            var messages1 = result.rows;
            client.query("SELECT * FROM messages WHERE from_id = $1 AND to_id = $2", [to_id, from_id], (err, result1) => {
                if (err) {
                    callback(err, null);
                } else {
                    let datas = [...messages1, ...result1.rows];
                    let final_result = datas.sort((a,b) => new Date(a.created_at) - new Date(b.created_at));
                    callback(null, final_result);
                }
            })
        }
    })
};

module.exports.updateMessage = async function (params, callback) {
    const { id, text } = params;

    client.query(
        "UPDATE messages SET text = $2, updated_at = $3, is_updated = $4 WHERE id = $1 RETURNING id, text",
        [id, text, new Date(), true],
        (error, result) => {
            console.log('message update', error, result)
            if (error) {
                callback(error, null);
            } else {
                callback(error, result.rows[0]);
            }
            // client.end();
        }
    );
};

module.exports.deleteMessage = async function (params, callback) {
    const { id } = params;

    client.query(
        "UPDATE messages SET text = $2, updated_at = $3, is_updated = $4, is_deleted= $5 WHERE id = $1 RETURNING id",
        [id, null, new Date(), true, true],
        (error, result) => {
            console.log('delete message', error, result)
            if (error) {
                callback(error, null);
            } else {
                callback(error, result.rows[0]);
            }
            // client.end();
        }
    );
};

module.exports.receivedMessages = async function (params, callback) {
    const { from_id, to_id } = params;

    client.query(
        "UPDATE messages SET is_delivered = $3, delivered_at = $4 WHERE from_id = $1 AND to_id = $2 RETURNING id",
        [from_id, to_id, true, new Date()],
        (error, result) => {
            console.log('received message', error, result)
            if (error) {
                callback(error, null);
            } else {
                callback(error, result.rows[0]);
            }
            // client.end();
        }
    );
};

module.exports.readedMessages = async function (params, callback) {
    const { from_id, to_id } = params;

    client.query(
        "UPDATE messages SET is_read = $3, delivered_at = $4 WHERE from_id = $1 AND to_id = $2 RETURNING id",
        [from_id, to_id, true, new Date()],
        (error, result) => {
            console.log('read message', error, result)
            if (error) {
                callback(error, null);
            } else {
                callback(error, result.rows[0]);
            }
            // client.end();
        }
    );
};