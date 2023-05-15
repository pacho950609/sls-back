import SNS from 'aws-sdk/clients/sns';

const sns = new SNS();

export enum Topics {
    POTTER_TOPIC = 'arn:aws:sns:us-east-1:267965871015:potter-topic',
}

export interface TopicI {
    [Topics.POTTER_TOPIC]: { id: string };
}

/**
 * Send a event to a topic
 * @param topic 
 * @param message 
 */
export const sendTopicEvent = async <T extends Topics>(topic: T, message: TopicI[T]) => {
    await sns
        .publish({
            TopicArn: topic,
            Message: JSON.stringify(message),
        })
        .promise();
};
