import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import cn from 'classnames';
import { Filter } from './types/Filter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [filter, setFilter] = useState<Filter>(Filter.all);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  // const [isToggleAllLoading, setIsToggleAllLoading] = useState(false);

  const hideErrorMessage = () => {
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        hideErrorMessage();
      });
  }, []);

  const addTodo = (newTodo: Omit<Todo, 'id'>) => {
    setLoadingIds(currentIds => [...currentIds, newTodo.userId]);
    todoService
      .postTodo(newTodo)
      .then(addedTodo => {
        setTodos(currentTodos => [...currentTodos, addedTodo]);
        setNewTodoTitle('');
        setLoadingIds(currentIds =>
          currentIds.filter(id => id !== newTodo.userId),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setLoadingIds(currentIds =>
          currentIds.filter(id => id !== newTodo.userId),
        );
        hideErrorMessage();
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const deleteTodo = (userId: number) => {
    setLoadingIds(currentIds => [...currentIds, userId]);
    todoService
      .deleteTodo(userId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== userId),
        );
        setLoadingIds(currentIds => currentIds.filter(id => id !== userId));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setLoadingIds(currentIds => currentIds.filter(id => id !== userId));
        hideErrorMessage();
      });
  };

  const updateTodo = (todoId: number, newTitle: string) => {
    const todoToUpdate = todos.find(todo => todo.id === todoId);

    if (!todoToUpdate) {
      return;
    }

    const updatedTodo = { ...todoToUpdate, title: newTitle };

    setLoadingIds(currentIds => [...currentIds, todoId]);
    todoService
      .changeTodo(updatedTodo, todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.map(todo => (todo.id === todoId ? updatedTodo : todo)),
        );
        setLoadingIds(currentIds => currentIds.filter(id => id !== todoId));
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
        setLoadingIds(currentIds => currentIds.filter(id => id !== todoId));
        hideErrorMessage();
      });
  };

  const toggleTodoCompleted = (todoId: number) => {
    const todoToUpdate = todos.find(todo => todo.id === todoId);

    if (!todoToUpdate) {
      return;
    }

    const updatedTodo = { ...todoToUpdate, completed: !todoToUpdate.completed };

    setLoadingIds(currentIds => [...currentIds, todoId]);
    todoService
      .changeTodo(updatedTodo, todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.map(todo => (todo.id === todoId ? updatedTodo : todo)),
        );
        setLoadingIds(currentIds => currentIds.filter(id => id !== todoId));
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
        setLoadingIds(currentIds => currentIds.filter(id => id !== todoId));
        hideErrorMessage();
      });
  };

  const handleEmptyLineError = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = newTodoTitle.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');
      hideErrorMessage();

      return;
    }

    setTempTodo({
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: todoService.USER_ID,
    });

    addTodo({
      userId: todoService.USER_ID,
      title: trimmedTitle,
      completed: false,
    });
  };

  const handleChangeNewTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const handleClearCompleted = (ids: number[]) => {
    ids.forEach(id => {
      deleteTodo(id);
    });
  };

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      if (filter === Filter.active) {
        return !todo.completed;
      }

      if (filter === Filter.completed) {
        return todo.completed;
      }

      return true;
    });
  }, [todos, filter]);

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          newTodoTitle={newTodoTitle}
          handleChangeNewTitle={handleChangeNewTitle}
          handleEmptyLineError={handleEmptyLineError}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          tempTodo={tempTodo}
          setTodos={setTodos}
          setLoadingIds={setLoadingIds}
          loadingIds={loadingIds}
        />
        {!!todos && (
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            deleteTodo={deleteTodo}
            todosAreLoadingIds={loadingIds}
            updateTodo={updateTodo}
            toggleTodoCompleted={toggleTodoCompleted}
          />
        )}
        {!!todos.length && (
          <Footer
            todos={todos}
            onFilter={setFilter}
            filter={filter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
