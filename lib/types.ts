import type { FieldErrors, FieldValues, ResolverOptions } from 'react-hook-form';
import type { BaseIssue, BaseSchema, BaseSchemaAsync, Config, InferIssue } from 'valibot';

type Schema =
  | BaseSchema<unknown, unknown, BaseIssue<unknown>>
  | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>;

export type Resolver = <TSchema extends Schema>(
  schema: TSchema,
  schemaOptions?: Partial<Omit<Config<InferIssue<TSchema>>, 'abortPipeEarly' | 'skipPipe'>>,
  resolverOptions?: { mode?: 'sync' | 'async'; raw?: boolean },
) => (
  values: FieldValues,
  context: unknown,
  options: ResolverOptions<FieldValues>,
) => Promise<{ values: FieldValues; errors: FieldErrors }>;
