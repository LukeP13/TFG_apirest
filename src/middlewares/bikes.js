async function mapBikeId(req, res, done) {
  req.bikeId = req.params.id;
  done();
}

module.exports = {
  mapBikeId,
};
