import { FolderData, CopyHandlerData, LocationData } from '../../../actions';
import { LocationState } from '../../../providers/store/location';
import {
  ActionViewComponent,
  ActionViewProps,
  ActionViewState,
} from '../types';

export interface CopyViewState extends ActionViewState<CopyHandlerData> {
  folders: FoldersState;
  destination: LocationState;
  onSelectDestination: (location: LocationData, path?: string) => void;
}

export interface CopyViewProviderProps extends CopyViewState {
  children?: React.ReactNode;
}

export interface CopyViewProps extends ActionViewProps {}

export interface CopyViewComponent
  extends ActionViewComponent<CopyHandlerData, CopyViewProps> {
  Provider: (props: CopyViewProviderProps) => React.JSX.Element;
  Cancel: () => React.JSX.Element | null;
  Destination: () => React.JSX.Element | null;
  Exit: () => React.JSX.Element | null;
  Folders: () => React.JSX.Element | null;
  FoldersLoading: () => React.JSX.Element | null;
  FoldersMessage: () => React.JSX.Element | null;
  FoldersPagination: () => React.JSX.Element | null;
  FoldersSearch: () => React.JSX.Element | null;
  Message: () => React.JSX.Element | null;
  Start: () => React.JSX.Element | null;
  Statuses: () => React.JSX.Element | null;
  Tasks: () => React.JSX.Element | null;
  Title: () => React.JSX.Element | null;
}

export interface UseCopyViewOptions {
  onExit?: (location?: LocationData) => void;
}

export interface FoldersState {
  hasError: boolean;
  hasNextPage: boolean;
  highestPageVisited: number;
  isLoading: boolean;
  message: string | undefined;
  page: number;
  pageItems: FolderData[];
  query: string;
  onInitialize: () => void;
  onPaginate: (page: number) => void;
  onQuery: (value: string) => void;
  onSearch: () => void;
  onSearchClear: () => void;
  onSelectFolder: (id: string, folderLocationPath: string) => void;
}
