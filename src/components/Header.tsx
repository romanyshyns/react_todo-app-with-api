import cn from 'classnames';
import { Todo } from '../types/Todo';
import React, { useEffect, useRef, useState } from 'react';
import { USER_ID } from '../api/todos';

type Props = {
  todos: Todo[];
  onErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: ({ userId, title, completed }: Omit<Todo, 'id'>) => Promise<void>;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  todosInProcess: number[];
  updateTodo: (
    todoId: number,
    newTitle: string,
    completed?: boolean,
  ) => Promise<void> | undefined;
  errorMessage: string;
};

export const Header: React.FC<Props> = ({
  todos,
  onErrorMessage,
  onSubmit,
  setTempTodo,
  todosInProcess,
  updateTodo,
  errorMessage,
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isSubmiting, setIsSubmiting] = useState(false);
  const titleFiled = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleFiled.current) {
      titleFiled.current.focus();
    }
  }, [todos, errorMessage]);

  const allChecked = todos.every(todo => todo.completed);
  const handleNewTodoTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = newTodoTitle.trim();

    if (!trimmedTitle) {
      onErrorMessage('Title should not be empty');
      setTimeout(() => onErrorMessage(''), 3000);

      return;
    }

    setIsSubmiting(true);
    setTempTodo({
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    });
    onSubmit({
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    })
      .then(() => {
        setNewTodoTitle('');
      })
      .finally(() => {
        setIsSubmiting(false);
      });
  };

  const handleToggleAll = () => {
    const allCompleted = todos.every(todo => todo.completed);
    const newCompletedStatus = !allCompleted;
    const todosToUpdate = todos.filter(
      todo => todo.completed !== newCompletedStatus,
    );

    todosToUpdate.forEach(todo => {
      updateTodo(todo.id, todo.title, newCompletedStatus);
    });
  };

  const shouldShowToggleAllButton =
    todos.length > 0 && todosInProcess.length === 0;

  return (
    <header className="todoapp__header">
      {shouldShowToggleAllButton && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: allChecked })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={titleFiled}
          disabled={isSubmiting}
          value={newTodoTitle}
          onChange={handleNewTodoTitle}
        />
      </form>
    </header>
  );
};
