import * as Either from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';

const arrayToPath = (paths: Either.Either<string, number>[]): string =>
  paths.reduce<string>(
    (previous, path, index) =>
      pipe(
        path,
        Either.match(
          (key) => `${index > 0 ? '.' : ''}${key}`,
          (key) => `[${key}]`,
        ),
        (pathSegment) => `${previous}${pathSegment}`,
      ),
    '',
  );

export default arrayToPath;
