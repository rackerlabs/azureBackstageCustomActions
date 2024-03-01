import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import * as inputProps from './inputProperties';
import * as outputProps from './outputProperties';

async function pause(seconds: number) {
  return new Promise<void>(resolve => setTimeout(resolve, seconds * 1000));
}

export function pauseAction() {
  return createTemplateAction<{
    seconds: number;
  }>({
    id: 'custom:pause',
    schema: {
      input: {
        type: 'object',
        required: ['seconds'],
        properties: {
          seconds: inputProps.seconds,
        },
      },
      output: {
        type: 'object',
        properties: {
          success: outputProps.success,
        },
      },
    },
    async handler(ctx: any): Promise<void> {
      try {
        const { seconds } = ctx.input;
        await pause(seconds);
        ctx.output = { success: true }; // Setting the output
      } catch (error: any) {
        ctx.logger.error(`[ERROR] - ${error.message}`);
        throw new Error(`Failed to pause: ${error.message}`);
      }
    },
  });
}
