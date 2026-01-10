const getAuthUser = (req, res) => {
  return res.status(200).json({
    user: req.user || null,
  });
};

export default getAuthUser;
