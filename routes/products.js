const express = require("express");
const router = express.Router();
const db = require("../conf/db"); // Replace with your MySQL connection setup

// Fetch all products
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM products");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error fetching products." });
  }
});

// Fetch a single product by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute("SELECT * FROM products WHERE id = ?", [
      id,
    ]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: "Product not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching product." });
  }
});

// Create a new product
router.post("/", async (req, res) => {
  const {
    name,
    category,
    status,
    images,
    description,
    specifications,
    links,
    applications,
    projects,
  } = req.body;

  try {
    const [result] = await db.execute(
      "INSERT INTO products (name, category, status, images, description, specifications, links, applications, projects) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        name,
        category,
        status,
        JSON.stringify(images),
        description,
        JSON.stringify(specifications),
        JSON.stringify(links),
        JSON.stringify(applications),
        JSON.stringify(projects),
      ]
    );
    res
      .status(201)
      .json({ id: result.insertId, message: "Product created successfully." });
  } catch (error) {
    res.status(500).json({ error: "Error creating product." });
  }
});

// Update an existing product
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    name,
    category,
    status,
    images,
    description,
    specifications,
    links,
    applications,
    projects,
  } = req.body;

  try {
    const [result] = await db.execute(
      "UPDATE products SET name = ?, category = ?, status = ?, images = ?, description = ?, specifications = ?, links = ?, applications = ?, projects = ? WHERE id = ?",
      [
        name,
        category,
        status,
        JSON.stringify(images),
        description,
        JSON.stringify(specifications),
        JSON.stringify(links),
        JSON.stringify(applications),
        JSON.stringify(projects),
        id,
      ]
    );
    if (result.affectedRows > 0) {
      res.json({ message: "Product updated successfully." });
    } else {
      res.status(404).json({ error: "Product not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Error updating product." });
  }
});

// Delete a product
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.execute("DELETE FROM products WHERE id = ?", [
      id,
    ]);
    if (result.affectedRows > 0) {
      res.json({ message: "Product deleted successfully." });
    } else {
      res.status(404).json({ error: "Product not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Error deleting product." });
  }
});

module.exports = router;
