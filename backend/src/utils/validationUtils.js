function checkRequiredFields(fields, res) {
  for (const field of fields) {
    if (!field) {
      res.status(400).json({ error: "Missing required fields." });
      return false;
    }
  }
  return true;
}

function validateRequiredFields(fields, res) {
  const missingFields = fields
    .filter(([key, value]) => !value)
    .map(([key]) => key);
  if (missingFields.length > 0) {
    res.status(400).json({
      error: `Missing required fields: ${missingFields.join(", ")}`,
    });
    return false;
  }
  return true;
}

export { checkRequiredFields, validateRequiredFields };
