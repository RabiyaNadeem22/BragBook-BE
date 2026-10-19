/**
 * Standardized API Response Helper
 */
export const apiResponse = {
  /**
   * Send a successful JSON response
   * @param {import('express').Response} res
   * @param {any} data - payload
   * @param {string} [message='Success']
   * @param {number} [statusCode=200]
   * @param {object} [pagination=null]
   */
  success(res, data = null, message = 'Success', statusCode = 200, pagination = null) {
    const responseBody = {
      success: true,
      message,
      data,
    };

    if (pagination) {
      responseBody.pagination = pagination;
    }

    return res.status(statusCode).json(responseBody);
  },

  /**
   * Send an error JSON response
   * @param {import('express').Response} res
   * @param {string} message - error description
   * @param {number} [statusCode=500]
   * @param {any} [errors=null] - specific field errors
   */
  error(res, message = 'Internal Server Error', statusCode = 500, errors = null) {
    const responseBody = {
      success: false,
      message,
    };

    if (errors) {
      responseBody.errors = errors;
    }

    return res.status(statusCode).json(responseBody);
  },
};
