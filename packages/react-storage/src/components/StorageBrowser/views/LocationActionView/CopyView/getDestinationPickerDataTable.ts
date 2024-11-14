import { WithKey } from '../../../components/types';
import { DataTableProps } from '../../../composables/DataTable';
import { DataTableRow } from '../../../composables/DataTable/DataTable';

const DESTINATION_PICKER_COLUMNS: DataTableProps['headers'] = [
  { key: 'key', type: 'sort', content: { label: 'Folder name' } },
];

const getFolderNameFromKey = (key: string): string => {
  if (key === '') return 'root';
  const lastFolder = key.split('/').at(-2);
  return lastFolder ? lastFolder : '';
};

export const getDestinationPickerTableData = ({
  isLoading,
  items,
  handleNavigateFolder,
}: {
  isLoading: boolean;
  items: { key: string; id: string }[];
  handleNavigateFolder: (key: string) => void;
}): DataTableProps => {
  const rows: DataTableProps['rows'] = items.map((item) => {
    const row: WithKey<DataTableRow> = {
      key: item.id,
      content: [
        {
          key: item.id,
          type: 'button',
          content: {
            label: getFolderNameFromKey(item.key),
            icon: 'folder',
            onClick: () => {
              handleNavigateFolder(getFolderNameFromKey(item.key));
            },
          },
        },
      ],
    };
    return row;
  });

  const tableData: DataTableProps = {
    headers: DESTINATION_PICKER_COLUMNS,
    isLoading,
    rows,
  };
  return tableData;
};
