import React, { useEffect, useRef } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { changeTodo } from '../api/todos';

type Props = {
  todos: Todo[];
  newTodoTitle: string;
  handleChangeNewTitle: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleEmptyLineError: (event: React.FormEvent) => void;
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  tempTodo: Todo | null;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setLoadingIds: React.Dispatch<React.SetStateAction<number[]>>;
  loadingIds: number[];
};

export const Header: React.FC<Props> = ({
  todos,
  newTodoTitle,
  handleChangeNewTitle,
  handleEmptyLineError,
  errorMessage,
  setErrorMessage,
  tempTodo,
  setTodos,
  setLoadingIds,
  loadingIds,
}) => {
  const allChecked = todos.every(todo => todo.completed);
  const newTodoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    newTodoRef.current?.focus();
  }, [todos, errorMessage]);

  const toggleAll = () => {
    const allCompleted = todos.every(todo => todo.completed);
    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: !allCompleted,
    }));

    const todosToUpdate = updatedTodos.filter(
      todo => todo.completed !== allCompleted,
    );

    const ids = todosToUpdate.map(todo => todo.id);

    setLoadingIds(currentIds => [...currentIds, ...ids]);

    Promise.all(todosToUpdate.map(todo => changeTodo(todo, todo.id)))
      .then(() => {
        setTodos(updatedTodos);
        setLoadingIds(currentIds => currentIds.filter(id => !ids.includes(id)));
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);

        setLoadingIds(currentIds => currentIds.filter(id => !ids.includes(id)));
      });
  };

  const shouldShowToggleAllButton = todos.length > 0 && loadingIds.length === 0;

  return (
    <header className="todoapp__header">
      {shouldShowToggleAllButton && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: allChecked })}
          data-cy="ToggleAllButton"
          onClick={toggleAll}
        />
      )}

      <form onSubmit={handleEmptyLineError}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={handleChangeNewTitle}
          disabled={!!tempTodo}
          ref={newTodoRef}
        />
      </form>
    </header>
  );
};
