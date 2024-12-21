function checkRequiredFields(fields, res) {
  for (const field of fields) {
    if (!field) {
      res.status(400).json({ error: "Missing required fields." });
      return false;
    }
  }
  return true;
}

export { checkRequiredFields };
