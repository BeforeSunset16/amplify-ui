import { humanFileSize } from '@aws-amplify/ui';

import { DataTableProps } from '../../../composables/DataTable';

import { LOCATION_DETAIL_VIEW_HEADERS } from './constants';

export const getFileRowContent = ({
  isSelected,
  itemLocationKey,
  lastModified,
  rowId,
  rowKey,
  selectFileLabel,
  size,
  onDownload,
  onSelect,
}: {
  isSelected: boolean;
  itemLocationKey: string;
  lastModified: Date;
  rowId: string;
  rowKey: string;
  selectFileLabel: string;
  size: number;
  onDownload: () => void;
  onSelect: () => void;
}): DataTableProps['rows'][number]['content'] =>
  LOCATION_DETAIL_VIEW_HEADERS.map(({ key: columnKey }) => {
    const key = `${columnKey}-${rowId}`;
    switch (columnKey) {
      case 'checkbox': {
        return {
          key,
          type: 'checkbox',
          content: {
            checked: isSelected,
            label: `${selectFileLabel} ${rowKey}`,
            onSelect,
          },
        };
      }
      case 'name': {
        return {
          key,
          type: 'text',
          content: { icon: 'file', text: rowKey.slice(itemLocationKey.length) },
        };
      }
      case 'type': {
        const splitKey = rowKey.split('.');
        return {
          key,
          type: 'text',
          content: {
            text: `${
              splitKey.length > 1 && splitKey[0] ? splitKey.pop() : '-'
            }`,
          },
        };
      }
      case 'last-modified': {
        return { key, type: 'date', content: { date: lastModified } };
      }
      case 'size': {
        return {
          key,
          type: 'number',
          content: {
            value: size,
            displayValue: humanFileSize(size, true),
          },
        };
      }
      case 'download': {
        return {
          key,
          type: 'button',
          content: { icon: 'download', onClick: onDownload },
        };
      }
    }
  });
