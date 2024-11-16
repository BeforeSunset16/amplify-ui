import { DEFAULT_ACTION_VIEW_DISPLAY_TEXT } from './shared';
import { DefaultUploadViewDisplayText } from '../../types';
import { UPLOAD_FILE_SIZE_LIMIT } from '../../../views/LocationActionView/constants';

export const DEFAULT_UPLOAD_VIEW_DISPLAY_TEXT: DefaultUploadViewDisplayText = {
  ...DEFAULT_ACTION_VIEW_DISPLAY_TEXT,
  title: 'Upload',
  actionStartLabel: 'Upload',
  addFilesLabel: 'Add files',
  addFolderLabel: 'Add folder',
  getActionCompleteMessage: (data) => {
    const { counts } = data ?? {};
    const { COMPLETE, FAILED, OVERWRITE_PREVENTED } = counts ?? {};

    const hasPreventedOverwrite = !!OVERWRITE_PREVENTED;
    const hasFailure = !!FAILED;
    const hasSuccess = !!COMPLETE;

    const preventedOverwriteMessage = !hasPreventedOverwrite
      ? undefined
      : `Overwrite prevented for ${OVERWRITE_PREVENTED} file${
          OVERWRITE_PREVENTED > 1 ? 's' : ''
        }`;

    const failedMessage = !hasFailure
      ? undefined
      : `${FAILED} file${FAILED > 1 ? 's' : ''} failed to upload`;

    const completedMessage = !hasSuccess
      ? undefined
      : `${COMPLETE} file${COMPLETE > 1 ? 's' : ''} uploaded`;

    const type = hasFailure
      ? 'error'
      : hasPreventedOverwrite
      ? 'warning'
      : 'success';

    // some failures, some prevented overwrites, some success
    if (hasFailure && hasPreventedOverwrite && hasSuccess) {
      return {
        content: `${preventedOverwriteMessage}, ${failedMessage}, ${completedMessage}.`,
        type,
      };
    }

    // some failures, some prevented overwrites, no success
    if (hasFailure && hasPreventedOverwrite && !hasSuccess) {
      return {
        content: `${preventedOverwriteMessage}, ${failedMessage}.`,
        type,
      };
    }

    // some failures, no overwrite, some success
    if (hasFailure && !hasPreventedOverwrite && hasSuccess) {
      return {
        content: `${failedMessage}, ${completedMessage}.`,
        type,
      };
    }

    // no failures, some prevented overwrites, some success
    if (!hasFailure && hasPreventedOverwrite && hasSuccess) {
      return {
        content: `${preventedOverwriteMessage}, ${completedMessage}.`,
        type,
      };
    }

    // all failures
    if (hasFailure && !hasPreventedOverwrite && !hasSuccess) {
      return { content: 'All files failed to upload.', type };
    }

    // all prevented overwrites
    if (!hasFailure && hasPreventedOverwrite && !hasSuccess) {
      return { content: 'Overwrite prevented for all files.', type };
    }

    return { content: 'All files uploaded.', type };
  },
  getFilesValidationMessage: ({ invalidFiles } = {}) => {
    if (!invalidFiles) {
      return undefined;
    }
    const fileNames = invalidFiles
      .filter(({ file }) => file.size > UPLOAD_FILE_SIZE_LIMIT)
      .map(({ file }) => file.name)
      .join(', ');
    return {
      content: `These files cannot be added to the upload queue due to they are larger than 160GB respectively: ${fileNames}`,
      type: 'warning',
    };
  },
  statusDisplayOverwritePreventedLabel: 'Overwrite prevented',
  overwriteToggleLabel: 'Overwrite existing files',
};
