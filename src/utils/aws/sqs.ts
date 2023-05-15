import * as lambda from 'aws-lambda';
import SQS from 'aws-sdk/clients/sqs';

const sqs = new SQS();

export enum Queues {
    // arn:aws:sqs:us-east-1:267965871015:potter-queue
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

/**
 * Parse and type a SQS message
 */
export const parseQueueMessage = <T extends Queues>(eventType: T, event: lambda.SQSEvent): QueueI[T] => {
    return JSON.parse(event.Records[0].body) as QueueI[T];
};