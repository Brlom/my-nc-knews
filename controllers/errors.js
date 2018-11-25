exports.handle405s = (req, res, next) => {
  next({ status: 405, msg: 'Method not allowed' });
};
