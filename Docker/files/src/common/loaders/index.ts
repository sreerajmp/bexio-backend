import expressLoader from './express';
// import connectDB from '../loaders/msSqlDb';
export default async ({ expressApp }) => {
	// Establish a database connection for node's process
	
	// await connectDB();
	// Load dependencies
	console.info('✌️ Express loaded');
	await expressLoader({ app: expressApp });
};
