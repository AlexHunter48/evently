const TodoModel = require("../model/todomodel");

//crud
const getAllTodos = async (req, res) => {
  try {
    const todos = await TodoModel.find();
    return res.status(200).json({
      message: "All Todos",
      data: todos,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const getOneTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await TodoModel.findById(id);
    return res.status(200).json({
      message: "Todo found",
      data: todo,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const createTodo = async (req, res) => {
  try {
    const { title, details } = req.body;
    const todo = await TodoModel.create({ title, details });
    return res.status(201).json({
      message: "Todo created",
      data: todo,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    
    const todo = await TodoModel.findByIdAndUpdate(
      id,
      { completed: true },
      { new: true },
    );
    return res.status(200).json({
      message: "Todo updated",
      data: todo,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    await TodoModel.findByIdAndDelete(id);
    return res.status(200).json({
      message: "Todo deleted",
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
    getAllTodos,
    getOneTodo,
    createTodo,
    updateTodo,
    deleteTodo
}