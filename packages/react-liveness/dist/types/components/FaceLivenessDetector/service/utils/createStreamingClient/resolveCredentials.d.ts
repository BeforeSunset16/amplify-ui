import { AwsCredentialProvider, AwsCredentials } from '../../types';
/**
 * Resolves the `credentials` param to be passed to `RekognitionStreamingClient` which accepts either:
 * - a `credentials` object
 * - a `credentialsProvider` callback
 *
 * @param credentialsProvider optional `credentialsProvider` callback
 * @returns {Promise<AwsCredentials | AwsCredentialProvider>} `credentials` object or valid `credentialsProvider` callback
 */
export declare function resolveCredentials(credentialsProvider?: AwsCredentialProvider): Promise<AwsCredentials | AwsCredentialProvider>;
