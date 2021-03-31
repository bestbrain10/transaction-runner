module.exports = (err, req, res) => {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  if (err.type && err.type === 'entity.parse.failed') {
    res.status(400).errorMessage('Invalid JSON payload passed.');
  } else if (err.toString() === '[object Object]') {
    res.status(400).error(err);
  } else {
    res.status(400).errorMessage(err.toString());
  }
};
