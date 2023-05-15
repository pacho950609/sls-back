import SQS from 'aws-sdk/clients/sqs';

const sqs = new SQS();

export enum Queues {
    POTTER_QUEUE = 'https://sqs.us-east-1.amazonaws.com/267965871015/potter-queue',
}

export interface QueueI {
    [Queues.POTTER_QUEUE]: { id: string };
}

/**
 * Send a message to a queue
 * @param queue 
 * @param message 
 */
export const sendQueueMessage = async <T extends Queues>(queue: T, message: QueueI[T]) => {
    const params: SQS.SendMessageRequest = {
        QueueUrl: queue,
        MessageBody: JSON.stringify(message),
    };
    return sqs.sendMessage(params).promise();
};
