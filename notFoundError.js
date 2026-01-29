export class NotFoundError extends Error {
  constructor(message = "Element does not exist!", ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotFoundError)
    }

    this.name = 'Duplicate error';
    this.message = message;
  }
}