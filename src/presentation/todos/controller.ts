import { Request, Response } from "express";
import { prisma } from "../../data/postgres";
import { CreateTodoDto } from "../../domain/dtos/todos/create-todo.dto";
import { UpdateTodoDto } from "../../domain/dtos/todos/update-todo.dto";

export class TodosController {
  //* DI
  constructor() {}

  public getTodos = async (req: Request, res: Response) => {
    const todos = await prisma.todo.findMany();

    return res.json({
      message: "Todos fetched successfully",
      status: true,
      data: todos,
    });
  };

  public getTodoById = async (req: Request, res: Response) => {
    const id = +req.params.id;
    if (isNaN(id)) {
      return res.status(400).json({
        message: "Invalid ID format. ID must be a number.",
        status: false,
        data: null,
      });
    }
    const todo = await prisma.todo.findUnique({
      where: { id },
    });
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

  public createTodo = async (req: Request, res: Response) => {
    const [error, createTodoDto] = CreateTodoDto.create(req.body);

    if (error) {
      return res.status(400).json({
        message: error,
        status: false,
        data: null,
      });
    }

    const todo = await prisma.todo.create({
      data: {
        task: createTodoDto!.text,
        createdAt: new Date(),
        completed: false,
      },
    });

    res.json({
      message: "Todo created successfully",
      status: true,
      data: todo,
    });
  };

  public updateTodo = async (req: Request, res: Response) => {
    const id = +req.params.id;
    const [error, updateTodoDto] = UpdateTodoDto.update({
      ...req.body,
      id,
    });

    if (error) {
      return res.status(400).json({
        message: error,
        status: false,
        data: null,
      });
    }

    const todo = await prisma.todo.findUnique({
      where: { id },
    });

    if (!todo) {
      return res.status(404).json({
        message: `Todo with id ${id} not found`,
        status: false,
        data: null,
      });
    }

    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: {
        task: updateTodoDto?.text,
        completed: updateTodoDto?.completed,
      },
    });
    res.json({
      message: "Todo updated successfully",
      status: true,
      data: updatedTodo,
    });
  };

  public deleteTodo = async (req: Request, res: Response) => {
    const id = +req.params.id;

    if (isNaN(id)) {
      return res.status(400).json({
        message: "Invalid ID format. ID must be a number.",
        status: false,
        data: null,
      });
    }

    const existingTodo = await prisma.todo.findUnique({
      where: { id },
    });

    // const existingTodo = todos.find((t) => t.id === id);

    if (!existingTodo) {
      return res.status(404).json({
        message: `Todo with id ${id} not found`,
        status: false,
        data: null,
      });
    }
    // Remove the todo from the array
    //splice index element, count to remove
    // todos.splice(todos.indexOf(todo), 1);

    const todoDeleted = await prisma.todo.delete({
      where: { id },
    });

    if (todoDeleted) {
      res.json({
        message: "Todo deleted successfully",
        status: true,
        data: todoDeleted,
      });
    } else {
      res.status(500).json({
        message: "Failed to delete todo",
        status: false,
        data: null,
      });
    }
  };
}
