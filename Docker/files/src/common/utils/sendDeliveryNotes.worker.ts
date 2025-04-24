const { parentPort } = require('worker_threads');
import { setDeliveryNotesBulk } from './helperfn';

// Listen for messages from the main thread
parentPort.on('message', async ({ deliveryItems, bodyParams, headerParams, id }) => {
  try {
    console.log('deliveryItems',deliveryItems);
    
    console.log('Send Order Worker Received:', { bodyParams, deliveryItems });

    // Perform the task
    await setDeliveryNotesBulk(deliveryItems, bodyParams, headerParams);

    // Send success response back to the main thread
    parentPort.postMessage({ id, status: 'success' });
  } catch (error) {
    console.error('Error in Send Order Worker:', error);

    // Send error response back to the main thread
    parentPort.postMessage({ id, status: 'error', error: error.message });
  }
});