import { CodeView } from '@snow/core/components';
import { useTabInfo } from '@snow/core/hooks';
import type { TestStep } from '@snow/core/shared';

import { useMemo } from 'react';

export interface CodeDisplayProps {
  steps: TestStep[];
}

export const CodeDisplay = ({ steps }: CodeDisplayProps) => {
  const { tab } = useTabInfo();

  const code = useMemo(() => {
    const navigateCode = tab?.url
      ? `await page.goto('${tab?.url}');\n\nawait page.waitForLoadState('networkidle');`
      : '';

    const stepCodes = steps.map(step => {
      if (step.status === 'failed') {
        return `// Execution failed, skipping\n// ${step.rawCode}`;
      }
      if (step.status === 'pending') {
        return `// Not executed, skipping\n// ${step.rawCode}`;
      }
      if (step.status === 'skipped') {
        return `// Manually skipped\n// ${step.rawCode}`;
      }
      return step.rawCode;
    });

    return [navigateCode, ...stepCodes].filter(Boolean).join('\n\n');
  }, [steps, tab]);

  return (
    <div className="relative rounded-lg border text-card-foreground shadow-sm overflow-hidden h-full">
      <CodeView code={code} showLineNumbers={false} />
    </div>
  );
};
