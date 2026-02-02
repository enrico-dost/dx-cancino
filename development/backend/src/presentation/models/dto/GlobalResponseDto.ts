/**
 * Global Response DTO
 * Standard response structure for all API endpoints
 * Following DX_Guideline_Backend standards
 */
export interface GlobalResponseDto<T = any> {
  status: number;
  message: string;
  data?: T;
}

/**
 * Success Response DTO
 * Standard success response structure
 */
export interface SuccessResponseDto<T = any> extends GlobalResponseDto<T> {
  status: number;
  message: string;
  data: T;
}

/**
 * Error Response DTO
 * Standard error response structure
 */
export interface ErrorResponseDto extends GlobalResponseDto {
  status: number;
  message: string;
  data?: any;
}

/**
 * Helper function to create success response
 */
export const createSuccessResponse = <T>(data: T, statusCode: number = 200): SuccessResponseDto<T> => ({
  status: statusCode,
  message: 'success',
  data
});

/**
 * Helper function to create error response
 */
export const createErrorResponse = (message: string, statusCode: number = 500, data?: any): ErrorResponseDto => ({
  status: statusCode,
  message,
  data
});