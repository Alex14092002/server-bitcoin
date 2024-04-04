import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017/bitcoin', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', () => {
    console.log('MongoDB connection successful');
});

export default db;
