const mongoose = require('mongoose');

const dbUrl = 'mongodb://unm-kvm-masterbus-4.planisys.net:3000/notifier';

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.on('error', console.error);

const messageSchema = new mongoose.Schema({
    text: String,
    url: String,
});

const Message = mongoose.model('Message', messageSchema);

const create = attrs => new Message(attrs).save();

const list = () => Message
    .find()
    .then(messages => messages.slice().reverse())
    .catch(e => {
        console.error(e);
    });

module.exports = { create, list };