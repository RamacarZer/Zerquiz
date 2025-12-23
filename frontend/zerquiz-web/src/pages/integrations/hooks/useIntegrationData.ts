import { useState, useEffect } from 'react';

export interface LTIConnection {
  id: string;
  name: string;
  platform: string;
  status: 'active' | 'inactive';
  lastSync: string;
}

export interface APIKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string;
  status: 'active' | 'revoked';
}

const mockLTIConnections: LTIConnection[] = [
  { id: '1', name: 'Canvas LMS', platform: 'Canvas', status: 'active', lastSync: '2024-01-20 10:30' },
  { id: '2', name: 'Moodle Integration', platform: 'Moodle', status: 'active', lastSync: '2024-01-19 15:45' },
];

const mockAPIKeys: APIKey[] = [
  { id: '1', name: 'Mobile App Key', key: 'zrq_live_xxxxxxxxxxxxxx', createdAt: '2024-01-10', lastUsed: '2024-01-20', status: 'active' },
  { id: '2', name: 'Analytics Service', key: 'zrq_live_yyyyyyyyyyyyyy', createdAt: '2024-01-05', lastUsed: '2024-01-18', status: 'active' },
];

export function useIntegrationData() {
  const [loading, setLoading] = useState(false);
  const [ltiConnections, setLtiConnections] = useState<LTIConnection[]>(mockLTIConnections);
  const [apiKeys, setApiKeys] = useState<APIKey[]>(mockAPIKeys);

  const fetchData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { loading, ltiConnections, apiKeys, refreshData: fetchData };
}

