import mongoose, { Connection } from 'mongoose';

const mongoURI: string = process.env.MONGODB_URI || '';


mongoose.connect(mongoURI)
  .then(() => {

    console.log('Connected to MongoDB');


  })
  .catch((error: any) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  });


