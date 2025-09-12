import { nanoid } from 'nanoid';
import EventEmitter from 'eventemitter3';
import { AutomationAgent } from './AutomationAgent';
import type { TestCase, TestStep } from '../automationTypes';

export interface TestCaseExecutorEvents {
  caseStatusChanged: { executor: TestCaseExecutor; testCase: TestCase };
  stepStarted: { executor: TestCaseExecutor; step: TestStep; stepId: string };
  stepCompleted: { executor: TestCaseExecutor; step: TestStep; stepId: string };
  caseParsed: { executor: TestCaseExecutor; testCase: TestCase };
  caseExecutionFinished: { executor: TestCaseExecutor; testCase: TestCase };
}

export type TestCaseExecutorEventName = keyof TestCaseExecutorEvents;

export class TestCaseExecutor {
  private testCase: TestCase;
  private agent: AutomationAgent = new AutomationAgent();
  private isDestroyed = false;
  private eventEmitter = new EventEmitter<TestCaseExecutorEvents>();

  constructor(testCaseData: Omit<TestCase, 'id' | 'steps' | 'status'>) {
    this.testCase = {
      ...testCaseData,
      id: nanoid(),
      steps: [],
      status: 'created',
    };
  }

  static fromTestCase(testCase: TestCase): TestCaseExecutor {
    const executor = new TestCaseExecutor({
      name: testCase.name,
      userInput: testCase.userInput,
      code: testCase.code,
      actionSequence: testCase.actionSequence,
    });
    executor.testCase = { ...testCase };
    return executor;
  }

  getTestCase(): TestCase {
    return { ...this.testCase };
  }

  getStatus(): TestCase['status'] {
    return this.testCase.status;
  }

  canExecute(): boolean {
    return this.agent?.isReady() ?? false;
  }

  async parse(): Promise<void> {
    if (this.isDestroyed) return;

    if (!this.agent) {
      throw new Error('Agent not available');
    }

    try {
      this.testCase.steps = this.agent.parseTestCodeOrActionSequence(this.testCase.actionSequence, this.testCase.code);
      this.emit('caseParsed', { executor: this, testCase: this.getTestCase() });
    } catch (error) {
      this.testCase.error = error instanceof Error ? error.message : 'Unknown code parsing error';
      this.updateStatus('failed');
      throw error;
    }
  }

  async execute(): Promise<TestCase> {
    this.updateStatus('running');
    this.testCase.startTime = Date.now();

    try {
      const result = await this.executeStepsWithProgress();
      const success = result.every(step => step.status === 'success');

      this.testCase.status = success ? 'completed' : 'failed';
      this.testCase.endTime = Date.now();

      this.updateStatus(this.testCase.status);
      return this.getTestCase();
    } catch (error) {
      this.updateStatus('failed');
      throw error;
    }
  }

  private async executeStepsWithProgress(): Promise<TestStep[]> {
    if (!this.agent) {
      throw new Error('Agent not available');
    }

    for (let i = 0; i < this.testCase.steps.length; i++) {
      const step = this.testCase.steps[i];

      step.status = 'running';
      step.startTime = Date.now();

      this.emit('stepStarted', { executor: this, step, stepId: step.id });
      const result = await this.agent.executeStep(step);
      this.emit('stepCompleted', { executor: this, step, stepId: step.id });

      if (result.status === 'failed') {
        break;
      }
    }
    return this.testCase.steps;
  }

  stop(): void {
    if (this.testCase.status === 'running') {
      this.updateStatus('stopped');
    }
  }

  reset(): void {
    this.testCase.status = 'created';
    this.testCase.steps = [];
    this.emit('caseStatusChanged', { executor: this, testCase: this.getTestCase() });
  }

  async destroy(): Promise<void> {
    this.isDestroyed = true;
    this.eventEmitter.removeAllListeners();
    await this.agent.destroy();
  }

  private updateStatus(status: TestCase['status']): void {
    this.testCase.status = status;
    this.emit('caseStatusChanged', { executor: this, testCase: this.getTestCase() });
  }

  on<T extends TestCaseExecutorEventName>(
    event: T,
    listener: (data: TestCaseExecutorEvents[T]) => void,
  ): void {
    this.eventEmitter.on(event, listener as any);
  }

  off<T extends TestCaseExecutorEventName>(
    event: T,
    listener: (data: TestCaseExecutorEvents[T]) => void,
  ): void {
    this.eventEmitter.off(event, listener as any);
  }

  emit<T extends TestCaseExecutorEventName>(event: T, data: TestCaseExecutorEvents[T]): void {
    this.eventEmitter.emit(event, data);
  }
}
