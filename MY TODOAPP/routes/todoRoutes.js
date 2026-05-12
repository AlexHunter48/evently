const express = require("express");
const router = express.Router();
const {
  getAllTodos,
  createTodo,
  deleteTodo,
  getOneTodo,
  updateTodo,
} = require("../controller/todoController");

router.get("/get-todos", getAllTodos);
router.get("/:id", getOneTodo);
router.post("/create-todos", createTodo);
router.patch("/update-todos/:id", updateTodo);
router.delete("/delete-todos/:id", deleteTodo);

module.exports = router;