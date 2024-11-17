import {
  listLocationItemsHandler,
  listLocationsHandler,
  createFolderHandler,
  uploadHandler,
  copyHandler,
  deleteHandler,
} from '../handlers';

import {
  CopyActionConfig,
  CreateFolderActionConfig,
  DeleteActionConfig,
  ListLocationItemsActionConfig,
  ListLocationsActionConfig,
  UploadActionConfig,
} from './types';

export const copyActionConfig: CopyActionConfig = {
  componentName: 'CopyView',
  actionListItem: {
    disable: (selected) => !selected,
    hide: (permissions) => !permissions.includes('write'),
    // missing copy icon
    icon: 'download',
    label: 'Copy Files',
  },
  handler: copyHandler,
};

export const deleteActionConfig: DeleteActionConfig = {
  componentName: 'DeleteView',
  actionListItem: {
    disable: (selected) => !selected,
    hide: (permissions) => !permissions.includes('delete'),
    icon: 'delete-file',
    label: 'Delete Files',
  },
  handler: deleteHandler,
};

export const createFolderActionConfig: CreateFolderActionConfig = {
  componentName: 'CreateFolderView',
  actionListItem: {
    disable: (selected) => !!selected,
    hide: (permissions) => !permissions.includes('write'),
    icon: 'create-folder',
    label: 'Create Folder',
  },
  handler: createFolderHandler,
};

export const listLocationItemsActionConfig: ListLocationItemsActionConfig = {
  componentName: 'LocationDetailView',
  handler: listLocationItemsHandler,
};

export const listLocationsActionConfig: ListLocationsActionConfig = {
  componentName: 'LocationsView',
  handler: listLocationsHandler,
};

export const uploadActionConfig: UploadActionConfig = {
  componentName: 'UploadView',
  actionListItem: {
    disable: (selectedValues) => !!selectedValues,
    fileSelection: 'FILE',
    hide: (permissions) => !permissions.includes('write'),
    icon: 'upload-file',
    label: 'Upload',
  },
  handler: uploadHandler,
};

export const defaultActionViewConfigs = {
  copy: copyActionConfig,
  createFolder: createFolderActionConfig,
  delete: deleteActionConfig,
  upload: uploadActionConfig,
};

export type DefaultActionViewType = keyof typeof defaultActionViewConfigs;

export const DEFAULT_ACTION_VIEW_TYPES = Object.keys(
  defaultActionViewConfigs
) as DefaultActionViewType[];

export const isDefaultActionViewType = (
  value?: string
): value is DefaultActionViewType =>
  DEFAULT_ACTION_VIEW_TYPES.some((type) => type === value);

export const defaultActionConfigs = {
  ...defaultActionViewConfigs,
  listLocationItems: listLocationItemsActionConfig,
  listLocations: listLocationsActionConfig,
};
