function status(req, res) {
  return res.status(200).json({ teste: "Teste API STATUS" });
}

export default status;
