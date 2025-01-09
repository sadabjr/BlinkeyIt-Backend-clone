const authMiddleware = (request, response, next) => {
  try {
    const token = request.cookies.accessToken || request?.header?.authorization.split(" ")[1] // ["Bearer", "Token"] this header is for mobile version because cookies are not availabe on mobile

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};


export default authMiddleware;