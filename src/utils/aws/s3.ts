import S3 from 'aws-sdk/clients/s3';
import path from 'path';
import { FileContentType } from 'utils/files';

const s3 = new S3();

export enum Buckets {
    POTTER = 'potter-files',
}

/**
 * Uploads a file in a S3 bucket
 * @param file file to upload
 * @param filename file Name
 * @param bucket the url of the bucket, bucket must exist en AWS
 * @param folder a folder inside the bucket to save the file
 * @param contentType the extension of the file
 */
export const uploadFile = async (
    file,
    filename: string,
    bucket: Buckets,
    folder: string,
    contentType: FileContentType,
): Promise<string> => {
    const bucketPath = path.join(bucket, folder);
    const responseS3 = await s3
        .upload({
            Bucket: bucketPath,
            Key: filename,
            Body: file,
            ContentType: contentType,
        })
        .promise();
    return responseS3.Location;
};

/**
 * Gets a signed url from an object in a specified bucket
 * @param fileKey - file name to look for
 * @param bucketName - bucket name to search in
 * @param folder - folder name to search in
 * @param expireTime In seconds
 */
export const getSignedUrl = async (
    fileKey: string,
    bucketName: Buckets,
    folder: string,
    expireTime = 300,
): Promise<string> => {
    const bucketPath = path.join(bucketName, folder);
    const params = { Bucket: bucketPath, Key: fileKey, Expires: expireTime };
    return await s3.getSignedUrlPromise('getObject', params);
};

/**
 * Gets a signed url for a post request to S3
 * @param {string} filePath - file path that we'll be used
 * @param {string} bucketName - bucket name to upload the file to
 * @param {Object} additionalParams additional params to include in the request
 */
export const createPresignedPostURL = async (
    filePath: string,
    bucketName: Buckets,
    additionalParams: S3.PresignedPost.Params = {},
): Promise<S3.PresignedPost> => {
    const params: S3.PresignedPost.Params = {
        ...additionalParams,
        Bucket: bucketName,
        Conditions: [],
        Fields: {
            key: filePath,
        },
    };
    return s3.createPresignedPost(params);
};
