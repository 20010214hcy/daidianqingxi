/**
 * 统一 API 响应格式工具
 */

// 响应状态码
export const ResponseCode = {
  SUCCESS: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
}

/**
 * 成功响应
 * @param data 返回数据
 * @param message 提示信息
 * @returns 标准化响应对象
 */
export function successResponse<T>(data: T, message = '操作成功') {
  return {
    code: ResponseCode.SUCCESS,
    success: true,
    message,
    data,
    timestamp: Date.now(),
  }
}

/**
 * 失败响应
 * @param message 错误信息
 * @param code 状态码
 * @returns 标准化响应对象
 */
export function errorResponse(message = '操作失败', code = ResponseCode.INTERNAL_ERROR) {
  return {
    code,
    success: false,
    message,
    data: null,
    timestamp: Date.now(),
  }
}

/**
 * 分页响应
 * @param list 数据列表
 * @param total 总数
 * @param page 当前页
 * @param pageSize 每页数量
 * @returns 标准化分页响应对象
 */
export function paginatedResponse<T>(list: T[], total: number, page: number, pageSize: number) {
  return {
    code: ResponseCode.SUCCESS,
    success: true,
    message: '获取成功',
    data: {
      list,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    },
    timestamp: Date.now(),
  }
}
