import { ErrorType, IResponseErrorData } from './types';

const getErrorType = ({ error }: IResponseErrorData) => {
  const lowerDesc = error.toLowerCase();
  switch (true) {
    case error === 'Ошибка авторизации':
      return ErrorType.InvalidToken;
    case error === 'Ошибка при валидации параметров':
      return ErrorType.InvalidParams;
    // case lowerDesc.startsWith('Invalid Purse '.toLowerCase()):
    //   return ErrorType.InvalidPurse;
    // TODO: add other errors

    default:
      return ErrorType.Unknown;
  }
};

export class ResponseError extends Error {
  name = this.constructor.name;

  public readonly type: ErrorType;
  public readonly code?: number;

  constructor(readonly body: IResponseErrorData) {
    super();
    this.message = !body.text ? body.error : `${body.error}: ${body.text}`;
    this.code = body.errCode;
    this.type = getErrorType(body);
  }

  get [Symbol.toStringTag](): string {
    return `Error ${this.name}; type=${this.type}${!this.code ? '' : `; code=${this.code}`}`;
  }

  toJSON(): Error & { type: ErrorType; code?: number } {
    return {
      message: this.message,
      name: this.name,
      type: this.type,
      code: this.code,
      stack: this.stack,
    };
  }
}

export class ParamsError extends Error {
  name = this.constructor.name;

  constructor(readonly message: string) {
    super();
    this.message = message;
  }

  get [Symbol.toStringTag](): string {
    return `[Error ${this.name}] ${this.message}`;
  }

  toJSON(): Error {
    return {
      message: this.message,
      name: this.name,
      stack: this.stack,
    };
  }
}
