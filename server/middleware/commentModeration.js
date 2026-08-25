const BANNED_WORDS = ["abuse", "idiot", "stupid"]; // Example list

export const moderateComment = (req, res, next) => {
  const { commentbody } = req.body;

  if (!commentbody) {
    return next();
  }

  const lowerCaseComment = commentbody.toLowerCase();

  // 1. Abusive Word Filter
  for (const word of BANNED_WORDS) {
    if (lowerCaseComment.includes(word)) {
      return res.status(400).json({ message: "Comment contains inappropriate language and cannot be posted." });
    }
  }

  // 2. Special Character Spam Filter (e.g., >50% special characters)
  const specialChars = commentbody.match(/[^a-zA-Z0-9\s]/g) || [];
  if (specialChars.length > commentbody.length / 2) {
    return res.status(400).json({ message: "Comment contains excessive special characters and is considered spam." });
  }

  // 3. Repeated Character Spam Filter (e.g., 'aaaaaa' or '!!!!!!')
  // Looks for any single character repeated 5 or more times in a row.
  if (/([a-zA-Z0-9!@#$%^&*()])\1{4,}/.test(lowerCaseComment)) {
     return res.status(400).json({ message: "Comment contains repetitive characters and is considered spam." });
  }


  // If all checks pass, proceed to the next function (the controller)
  next();
};