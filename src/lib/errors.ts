export class PylonError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PylonError';
  }
}

export class AuthError extends PylonError {
  constructor() {
    super(
      'No API key provided.\nSet PYLON_API_KEY environment variable or pass --api-key <key>'
    );
    this.name = 'AuthError';
  }
}

export class ApiError extends PylonError {
  public readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

export class ValidationError extends PylonError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function handleError(error: unknown): never {
  if (error instanceof PylonError) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
  if (error instanceof Error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
  console.error('An unexpected error occurred');
  process.exit(1);
}
