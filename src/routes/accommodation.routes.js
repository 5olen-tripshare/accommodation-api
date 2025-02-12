const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const app = express();

const {
  createAccommodation,
  getAllAccommodations,
  getAccommodationById,
  deleteAccommodation,
  updateAccommodation,
} = require("../services/accommodation.service");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const baseFolder = path.resolve(__dirname, "../../uploads");
    const userFolder = path.join(baseFolder);
    if (!fs.existsSync(baseFolder)) {
      fs.mkdirSync(userFolder, { recursive: true });
    }

    cb(null, userFolder);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const uploadMiddleware = (req, res, next) => {
  upload.array("files", 20)(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    const files = req.files || [];
    const errors = [];

    files.forEach((file) => {
      const allowedTypes = ["image/jpeg", "image/png"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.mimetype)) {
        errors.push(`Invalid file type: ${file.originalname}`);
      }

      if (file.size > maxSize) {
        errors.push(`File too large: ${file.originalname}`);
      }
    });

    if (errors.length > 0) {
      files.forEach((file) => {
        fs.unlinkSync(file.path);
      });

      return res.status(400).json({ errors });
    }

    req.files = files;

    next();
  });
};

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
router.post("/", uploadMiddleware, async (req, res) => {
  try {
    const {
      userId,
      name,
      localisation,
      price,
      topCriteria,
      description,
      interests,
      isAvailable,
      totalPlaces,
      numberRoom,
      squareMeter,
      bedRoom,
      ancienneImage,
    } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "L'id utilisateur est requis" });
    }

    console.log(req.files);

    const image = req.files ? req.files.map((file) => `${file.filename}`) : [];

    if (ancienneImage) {
      image.push(...ancienneImage);
    }

    const newAccommodation = {
      name: name,
      localisation: localisation,
      price: price,
      topCriteria: topCriteria || [],
      interests: interests || [],
      description: description,
      squareMeter: squareMeter,
      totalPlaces: totalPlaces,
      numberRoom: numberRoom,
      bedRoom: bedRoom,
      image: image,
      isAvailable: isAvailable,
    };

    const accommodation = await createAccommodation(newAccommodation);
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
 *   put:
 *     summary: Remplace complètement un hébergement
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
router.put("/:id", uploadMiddleware, async (req, res) => {
  try {
    const {
      userId,
      name,
      localisation,
      price,
      topCriteria,
      description,
      interests,
      isAvailable,
      totalPlaces,
      numberRoom,
      squareMeter,
      bedRoom,
      ancienneImage,
    } = req.body;

    if (
      !userId ||
      !name ||
      !localisation ||
      !price ||
      !squareMeter ||
      !totalPlaces ||
      !numberRoom ||
      !bedRoom
    ) {
      return res.status(400).json({
        message: "Tous les champs obligatoires doivent être fournis.",
      });
    }

    console.log(req.files);

    const image =
      req.files && req.files.length > 0
        ? req.files.map((file) => `${file.filename}`)
        : [];

    if (ancienneImage) {
      image.push(...ancienneImage);
    }

    const updatedAccommodation = {
      userId,
      name,
      localisation,
      price,
      topCriteria: topCriteria || [],
      interests: interests || [],
      description,
      squareMeter,
      totalPlaces,
      numberRoom,
      bedRoom,
      image,
      isAvailable,
    };

    const accommodation = await updateAccommodation(
      req.params.id,
      updatedAccommodation
    );

    if (!accommodation) {
      return res.status(404).json({ message: "Hébergement non trouvé" });
    }

    res.json(accommodation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
