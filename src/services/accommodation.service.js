const Accommodation = require("../models/accommodation.model");

const createAccommodation = async (data) => {
  try {
    const newAccommodation = new Accommodation(data);
    return await newAccommodation.save();
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllAccommodations = async () => {
  return await Accommodation.find({ isAvailable: true });
};

const getAccommodationById = async (id) => {
  return await Accommodation.findById(id);
};

const getAccommodationsByUserId = async (userId) => {
  try {
    const accommodations = await Accommodation.find({ userId });
    return accommodations;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteAccommodation = async (id) => {
  return await Accommodation.findByIdAndDelete(id);
};

const updateAccommodation = async (id, data) => {
  return await Accommodation.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

const findAccommodationsByNameOrLocation = async (search) => {
  try {
    const accommodations = await Accommodation.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { localisation: { $regex: search, $options: "i" } },
      ],
      isAvailable: true,
    });
    return accommodations;
  } catch (error) {
    throw new Error(
      `Erreur lors de la recherche d'hébergements: ${error.message}`
    );
  }
};

module.exports = {
  createAccommodation,
  getAllAccommodations,
  getAccommodationById,
  deleteAccommodation,
  updateAccommodation,
  getAccommodationsByUserId,
  findAccommodationsByNameOrLocation,
};
