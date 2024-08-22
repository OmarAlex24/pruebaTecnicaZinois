import { HttpStatus } from '@nestjs/common';

export class SuccessResponse<T> {
  constructor(
    public readonly message: string,
    public readonly data?: T,
    public readonly statusCode: number = HttpStatus.OK,
  ) {}
}
