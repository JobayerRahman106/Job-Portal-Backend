const asyncHandler = (fn) => {
  try {
    return async (req, res, next) => {
      await fn(req, res, next);
    };
  } catch (error) {
    next(error);
  }
};

module.exports = asyncHandler;

// const asyncHandler = (fn) => {
//     return (req, res, next) => {
//         Promise.resolve(fn(req, res, next)).catch(next);
//     };
// };

// module.exports = asyncHandler;