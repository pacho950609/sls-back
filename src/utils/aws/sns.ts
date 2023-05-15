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
 * @param eventType 
 * @param message 
 */
export const sendTopicEvent = async <T extends Topics>(eventType: T, message: TopicI[T]) => {
    const arn = `arn:aws:sns:us-east-1:400557621329:${process.env.PROJECT}-${eventType}`;
    await sns
        .publish({
            TopicArn: arn,
            Message: JSON.stringify(message),
        })
        .promise();
};
