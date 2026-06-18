export class HttpStatusError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = new.target.name;
    this.statusCode = statusCode;
  }
}

export class UnauthorizedError extends HttpStatusError {
  constructor(message = "Unauthorized — authentication required.") {
    super(401, message);
  }
}

export class ForbiddenError extends HttpStatusError {
  constructor(message = "Forbidden — you do not have permission to perform this action.") {
    super(403, message);
  }
}

export class SecurityConfigurationError extends HttpStatusError {
  constructor(message = "Security configuration error.") {
    super(503, message);
  }
}