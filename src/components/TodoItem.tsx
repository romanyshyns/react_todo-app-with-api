/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  deleteTodo: (userId: number) => void;
  todosAreLoadingIds: number[];
  updateTodo: (todoId: number, newTitle: string) => void;
  toggleTodoCompleted: (todoId: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  todosAreLoadingIds,
  updateTodo,
  toggleTodoCompleted,
}) => {
  const [selectTitle, setSelectTitle] = useState(todo.title);
  const [changeTitle, setChangeTitle] = useState(false);

  const handleDelete = () => {
    if (todo.id !== undefined) {
      deleteTodo(todo.id);
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setSelectTitle(todo.title);
      setChangeTitle(false);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (selectTitle.trim()) {
      updateTodo(todo.id, selectTitle.trim());
      setChangeTitle(false);
    } else {
      deleteTodo(todo.id);
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => toggleTodoCompleted(todo.id)}
        />
      </label>

      {changeTitle ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={selectTitle}
            autoFocus
            onBlur={handleSubmit}
            onKeyUp={handleKeyUp}
            onChange={event => setSelectTitle(event.target.value)}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setChangeTitle(true)}
          >
            {selectTitle}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDelete}
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': todosAreLoadingIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
