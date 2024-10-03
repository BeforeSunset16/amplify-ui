import { Amplify } from 'aws-amplify';
import { createAIHooks, AIConversation } from '@aws-amplify/ui-react-ai';
import { generateClient } from 'aws-amplify/api';
import '@aws-amplify/ui-react/styles.css';
import '@aws-amplify/ui-react-ai/ai-conversation-styles.css';

import outputs from './amplify_outputs';
import type { Schema } from '@environments/ai/gen2/amplify/data/resource';
import { Authenticator, Card } from '@aws-amplify/ui-react';
import React from 'react';

const client = generateClient<Schema>({ authMode: 'userPool' });
const { useAIConversation } = createAIHooks(client);

Amplify.configure(outputs);

const formatDate = (date: Date): string =>
  `Argh the time be round ${date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  })}`;

function Chat() {
  const [
    {
      data: { messages },
      isLoading,
    },
    sendMessage,
  ] = useAIConversation('pirateChat');

  const displayText = React.useMemo(() => {
    return { getMessageTimestampText: formatDate };
  }, []);

  const suggestedPrompts = React.useMemo(
    () => [
      {
        inputText: 'hello',
        header: 'hello',
      },
      {
        inputText: 'how are you?',
        header: 'how are you?',
      },
    ],
    []
  );

  return (
    <Card variation="outlined" width="50%" height="300px" margin="0 auto">
      <AIConversation
        displayText={displayText}
        messages={messages}
        handleSendMessage={sendMessage}
        isLoading={isLoading}
        suggestedPrompts={suggestedPrompts}
        variant="bubble"
      />
    </Card>
  );
}

export default function Example() {
  return (
    <Authenticator>
      {({ user, signOut }) => {
        return <Chat />;
      }}
    </Authenticator>
  );
}
