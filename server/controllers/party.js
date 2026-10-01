import crypto from "crypto";

export const createParty = (req, res) => {
  try {
    const partyId = crypto.randomUUID();
    res.status(201).json({ partyId });
  } catch (error) {
    console.error("Error creating party:", error);
    res.status(500).json({ message: "Server error" });
  }
};