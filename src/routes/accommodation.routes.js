const express = require("express");
const {
  createAccommodation,
  getAllAccommodations,
  getAccommodationById,
  deleteAccommodation,
  updatePartialAccommodation,
} = require("../services/accommodation.service");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Accommodations
 *   description: API de gestion des hébergements
 */

/**
 * @swagger
 * /api/accommodations:
 *   post:
 *     summary: Créer un nouvel hébergement
 *     tags: [Accommodations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Hébergement créé avec succès.
 */
router.post("/", async (req, res) => {
  try {
    const accommodation = await createAccommodation(req.body);
    res.status(201).json(accommodation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/accommodations:
 *   get:
 *     summary: Récupérer tous les hébergements
 *     tags: [Accommodations]
 *     responses:
 *       200:
 *         description: Liste des hébergements.
 */
router.get("/", async (req, res) => {
  try {
    const accommodations = await getAllAccommodations();
    res.json(accommodations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/accommodations/{id}:
 *   get:
 *     summary: Récupérer un hébergement par son ID
 *     tags: [Accommodations]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Hébergement trouvé.
 */
router.get("/:id", async (req, res) => {
  try {
    const accommodation = await getAccommodationById(req.params.id);
    if (!accommodation) return res.status(404).json({ message: "Non trouvé" });
    res.json(accommodation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/accommodations/{id}:
 *   delete:
 *     summary: Supprimer un hébergement par son ID
 *     tags: [Accommodations]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Hébergement supprimé avec succès.
 */
router.delete("/:id", async (req, res) => {
  try {
    await deleteAccommodation(req.params.id);
    res.json({ message: "Hébergement supprimé" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/accommodations/{id}:
 *   patch:
 *     summary: Modifier partiellement un hébergement
 *     tags: [Accommodations]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Hébergement mis à jour avec succès.
 *       404:
 *         description: Hébergement non trouvé.
 */
router.patch("/:id", async (req, res) => {
  try {
    const accommodation = await updatePartialAccommodation(
      req.params.id,
      req.body
    );
    res.json(accommodation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
