import {
  AuthConfigAdapter,
  CreateManagedAuthConfigAdapterInput,
} from '@aws-amplify/storage/internals';

import { RegisterAuthListener } from '../context/useGetCredentialsProvider';

export interface StorageBrowserAuthAdapter extends AuthConfigAdapter {
  registerAuthListener: RegisterAuthListener;
}

export interface CreateManagedAuthAdapterInput
  extends CreateManagedAuthConfigAdapterInput {
  registerAuthListener: RegisterAuthListener;
}
