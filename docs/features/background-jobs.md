# Background Jobs and Workers

The application utilizes Node.js **Worker Threads** to offload heavy processing tasks, such as sending invoices to external APIs (Gate2B, SMTP) and generating delivery notes.

## PushWorkerHost

The `PushWorkerHost` class (`src/common/utils/push.worker.host.ts`) wraps a dedicated worker thread (`push.worker.js`) to handle invoice transmission.

### Worker Lifecycle
1.  **Bootstrap**: The worker thread is spawned when the application starts (`onApplicationBootstrap`).
2.  **Execution**: `run()` sends a message to the worker with a unique ID (`randomUUID`).
3.  **Response**: The host listens to the worker's message stream (via RxJS `fromEvent`), filters for the matching ID, and resolves the promise.
4.  **Shutdown**: The worker is terminated when the application shuts down.

### Task Payload
The worker accepts a payload containing:
-   `invoices`: The invoice data to process.
-   `bodyParams`: Context like `partyId`, `accountId`, `netcomId`.
-   `headerParams`: Session/Cookie data needed for subsequent API calls.
-   `channel`: The target channel (e.g., `'email'`, `'print'`).

## SendDeliveryNotesHost

Similar to `PushWorkerHost`, this service manages a worker for generating and sending delivery notes.

## Best Practices
-   **Statelessness**: Workers should be stateless; all context must be passed in the payload.
-   **Error Handling**: The `run()` method waits for a response. If the worker reports an error, it is thrown back to the main thread.
