import React from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';
import { Filter } from '../types/Filter';

type Props = {
  todos: Todo[];
  onFilter: React.Dispatch<React.SetStateAction<Filter>>;
  filter: Filter;
  onClearCompleted: (ids: number[]) => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  onFilter,
  filter,
  onClearCompleted,
}) => {
  const completedTodosId = todos
    .filter(todo => todo.completed)
    .map(todo => todo.id);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.filter(todo => !todo.completed).length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map(Value => (
          <a
            key={Value}
            href="#/"
            className={cn('filter__link', {
              selected: filter === Value,
            })}
            data-cy={`FilterLink${Value}`}
            onClick={() => onFilter(Value)}
          >
            {Value}
          </a>
        ))}
      </nav>
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedTodosId.length}
        onClick={() => onClearCompleted(completedTodosId)}
      >
        Clear completed
      </button>
    </footer>
  );
};
