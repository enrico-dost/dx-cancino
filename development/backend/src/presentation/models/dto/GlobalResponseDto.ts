export interface GlobalResponseDto<T = any> {
  status: number;
  message: string;
  data: T;
}

export const createSuccessResponse = <T>(data: T): GlobalResponseDto<T> => {
  return {
    status: 200,
    message: 'success',
    data
  };
};

export const createErrorResponse = (message: string, status: number = 500): GlobalResponseDto => {
  return {
    status,
    message,
    data: {}
  };
};
