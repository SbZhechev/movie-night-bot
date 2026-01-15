export class DuplicateError extends Error {
  constructor(message = "Element already exists!", ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DuplicateError)
    }

    this.name = 'Duplicate error';
    this.message = message;
  }
}