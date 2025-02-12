const AccommodationService = require("../services/accommodation.service");

const getAllAccommodations = async (req, res) => {
  try {
    const accommodations = await AccommodationService.getAllAccommodations();
    res.status(200).json(accommodations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAccommodationById = async (req, res) => {
  try {
    const accommodation = await AccommodationService.getAccommodationById(
      req.params.id
    );
    if (!accommodation)
      return res.status(404).json({ message: "Hébergement non trouvé" });
    res.status(200).json(accommodation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createAccommodation = async (req, res) => {
  try {
    const newAccommodation = await AccommodationService.createAccommodation(
      req.body
    );
    res.status(201).json(newAccommodation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteAccommodation = async (req, res) => {
  try {
    await AccommodationService.deleteAccommodation(req.params.id);
    res.status(200).json({ message: "Hébergement supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAccommodationService = async (req, res) => {
  try {
    const updatedAccommodation = await AccommodationService.updateAccommodation(
      req.params.id,
      req.body
    );

    if (!updatedAccommodation)
      return res.status(404).json({ message: "Hébergement non trouvé" });

    res.json(updatedAccommodation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAllAccommodations,
  getAccommodationById,
  createAccommodation,
  deleteAccommodation,
  updateAccommodationService,
};
