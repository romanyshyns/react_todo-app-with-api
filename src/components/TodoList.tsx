import { Todo } from '../types/Todo';
import { TempTodo } from './TempTodo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  deleteTodo: (userId: number) => void;
  todosAreLoadingIds: number[];
  updateTodo: (todoId: number, newTitle: string) => void;
  toggleTodoCompleted: (todoId: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  tempTodo,
  todosAreLoadingIds,
  updateTodo,
  toggleTodoCompleted,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          deleteTodo={deleteTodo}
          todosAreLoadingIds={todosAreLoadingIds}
          updateTodo={updateTodo}
          toggleTodoCompleted={toggleTodoCompleted}
        />
      ))}
      {tempTodo && <TempTodo tempTitle={tempTodo.title} />}
    </section>
  );
};
