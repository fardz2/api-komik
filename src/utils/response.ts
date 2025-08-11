// utils/response.ts
export const successResponse = <T>(data: T) => {
  return {
    message: true,
    data
  }
}

export const errorResponse = (error: string) => {
  return {
    message: false,
    error
  }
}
