export class UpdateTodoDto {
  private constructor(
    public readonly id: number,
    public readonly text: string,
    public readonly completed: boolean
  ) {}

  static update(props: { [key: string]: any }): [string?, UpdateTodoDto?] {
    const { text, completed, id } = props;

    if (!id || isNaN(id)) {
      return ["ID must be a number.", undefined];
    }

    if (!text || typeof completed !== "boolean") {
      return ["Text and completed status are required", undefined];
    }

    return [undefined, new UpdateTodoDto(id, text, completed)];
  }
}
