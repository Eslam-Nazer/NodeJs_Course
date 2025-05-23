/**
 * @description Error handler
 */
module.exports = (func) => {
  return (request, response, next) => {
    func(request, response, next).catch((error) => next(error));
  };
};
