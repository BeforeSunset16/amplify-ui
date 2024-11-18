import React from 'react';

import { uploadHandler } from '../../../actions';

import { useGetActionInput } from '../../../providers/configuration';
import { FileItems, useStore } from '../../../providers/store';
import { Task, useProcessTasks } from '../../../tasks';

import { DEFAULT_ACTION_CONCURRENCY } from '../constants';
import { UploadViewState, UseUploadViewOptions } from './types';
import { DEFAULT_OVERWRITE_ENABLED } from './constants';
import { isUndefined } from '@aws-amplify/ui';
import { isFileTooBig } from '../../../validators';

export const useUploadView = (
  options?: UseUploadViewOptions
): UploadViewState => {
  const [invalidFiles, setInvalidFiles] = React.useState<
    FileItems | undefined
  >();
  const { onExit: _onExit } = options ?? {};
  const getInput = useGetActionInput();
  const [{ files, location }, dispatchStoreAction] = useStore();
  const { current, key } = location;

  const validFiles = React.useMemo(() => {
    const validFileItems: FileItems = [];
    files?.forEach((fileItem) => {
      const { id, file } = fileItem;
      if (isFileTooBig(file)) {
        setInvalidFiles((prev) =>
          isUndefined(prev) ? [fileItem] : prev.concat(fileItem)
        );
        dispatchStoreAction({ type: 'REMOVE_FILE_ITEM', id });
      } else {
        validFileItems.push(fileItem);
      }
    });

    return validFileItems;
  }, [files, dispatchStoreAction]);

  const [isOverwritingEnabled, setIsOverwritingEnabled] = React.useState(
    DEFAULT_OVERWRITE_ENABLED
  );

  const [
    { isProcessing, isProcessingComplete, statusCounts, tasks },
    handleProcess,
  ] = useProcessTasks(uploadHandler, validFiles, {
    concurrency: DEFAULT_ACTION_CONCURRENCY,
    onTaskProgress: () => {
      if (invalidFiles) {
        setInvalidFiles(undefined);
      }
    },
  });

  const onDropFiles = React.useCallback(
    (files: File[]) => {
      if (files) {
        dispatchStoreAction({ type: 'ADD_FILE_ITEMS', files });
      }
    },
    [dispatchStoreAction]
  );

  const onSelectFiles = React.useCallback(
    (type?: 'FILE' | 'FOLDER') => {
      dispatchStoreAction({ type: 'SELECT_FILES', selectionType: type });
    },
    [dispatchStoreAction]
  );

  const onActionStart = React.useCallback(() => {
    handleProcess({
      config: getInput(),
      destinationPrefix: key,
      options: { preventOverwrite: !isOverwritingEnabled },
    });
  }, [isOverwritingEnabled, key, getInput, handleProcess]);

  const onActionCancel = React.useCallback(() => {
    tasks.forEach((task) => task.cancel?.());
  }, [tasks]);

  const onActionExit = React.useCallback(() => {
    // clear files state
    dispatchStoreAction({ type: 'RESET_FILE_ITEMS' });
    // clear selected action
    dispatchStoreAction({ type: 'RESET_ACTION_TYPE' });
    _onExit?.(current);
  }, [dispatchStoreAction, _onExit, current]);

  const onToggleOverwrite = React.useCallback(() => {
    setIsOverwritingEnabled((prev) => !prev);
  }, []);

  const onTaskRemove = React.useCallback(
    ({ data }: Task) => {
      dispatchStoreAction({ type: 'REMOVE_FILE_ITEM', id: data.id });
    },
    [dispatchStoreAction]
  );

  return {
    isProcessing,
    isProcessingComplete,
    isOverwritingEnabled,
    location,
    invalidFiles,
    statusCounts,
    tasks,
    onActionCancel,
    onActionExit,
    onActionStart,
    onDropFiles,
    onTaskRemove,
    onSelectFiles,
    onToggleOverwrite,
  };
};
