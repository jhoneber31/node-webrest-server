import { Request, Response } from "express";

const todos = [
  {
    id: 1,
    task: "Learn TypeScript",
    createdAt: new Date(),
    completed: false,
  },
  {
    id: 2,
    task: "Build a REST API",
    createdAt: new Date(),
    completed: false,
  },
  {
    id: 3,
    task: "Deploy to production",
    createdAt: new Date(),
    completed: false,
  },
];

export class TodosController {
  //* DI
  constructor() {}

  public getTodos = (req: Request, res: Response) => {
    return res.json({
      message: "Todos fetched successfully",
      status: true,
      data: todos,
    });
  };

  public getTodoById = (req: Request, res: Response) => {
    const id = +req.params.id;
    if (isNaN(id)) {
      return res.status(400).json({
        message: "Invalid ID format. ID must be a number.",
        status: false,
        data: null,
      });
    }
    const todo = todos.find((t) => t.id === id);
    todo
      ? res.json({
          message: "Todo found",
          status: true,
          data: todo,
        })
      : res.status(404).json({
          message: `Todo with id ${id} not found`,
          status: false,
          data: null,
        });
  };

  public createTodo = (req: Request, res: Response) => {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        message: "Text is required to create a todo",
        status: false,
        data: null,
      });
    }

    const newTodo = {
      id: todos.length + 1,
      task: text,
      createdAt: new Date(),
      completed: false,
    };

    todos.push(newTodo);

    res.json({
      message: "Todo created successfully",
      status: true,
      data: todos,
    });
  };

  public updateTodo = (req: Request, res: Response) => {
    const id = +req.params.id;

    if (isNaN(id)) {
      return res.status(400).json({
        message: "Invalid ID format. ID must be a number.",
        status: false,
        data: null,
      });
    }

    const todo = todos.find((t) => t.id === id);

    if (!todo) {
      return res.status(404).json({
        message: `Todo with id ${id} not found`,
        status: false,
        data: null,
      });
    }

    const { text, completed } = req.body;

    if (!text || typeof completed !== "boolean") {
      return res.status(400).json({
        message: "Text and completed status are required to update a todo",
        status: false,
        data: null,
      });
    }
    todo.task = text;
    todo.completed = completed;
    res.json({
      message: "Todo updated successfully",
      status: true,
      data: todos,
    });
  };

  public deleteTodo = (req: Request, res: Response) => {
    const id = +req.params.id;

    if (isNaN(id)) {
      return res.status(400).json({
        message: "Invalid ID format. ID must be a number.",
        status: false,
        data: null,
      });
    }

    const todo = todos.find((t) => t.id === id);

    if (!todo) {
      return res.status(404).json({
        message: `Todo with id ${id} not found`,
        status: false,
        data: null,
      });
    }
    // Remove the todo from the array
    //splice index element, count to remove
    todos.splice(todos.indexOf(todo), 1);
    res.json({
      message: "Todo deleted successfully",
      status: true,
      data: todo,
    });
  };
}
