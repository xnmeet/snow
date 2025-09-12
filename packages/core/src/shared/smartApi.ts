import type { ActionSequence } from '@/shared/schemas';
import axios from 'axios';

export interface GenerateTestCodeOptions {
  request: string;
}

export async function generateTestCode({ request }: GenerateTestCodeOptions): Promise<ActionSequence> {
  // your custom api that support generate test code
  const { data } = await axios.post('your custom api', {
    request,
  });
  return data.data;
}
