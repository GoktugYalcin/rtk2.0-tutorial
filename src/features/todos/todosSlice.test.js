import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { configureStore } from '@reduxjs/toolkit';
import todosSlice, { removeTodo, addTodo, getTodosFromService, editTodo } from './todosSlice';

describe('todosSlice', () => {
  let store;

  beforeEach(() => {
    store = configureStore({ reducer: { todos: todosSlice } });
  });

  it('should handle removeTodo', () => {
    store.dispatch(removeTodo(101));
    expect(store.getState().todos).not.toContainEqual({ userId: 6, id: 101, title: 'Kahvaltı yap', completed: true });
  });

  it('should handle addTodo', () => {
    const newTodo = { id: 104, text: 'New todo', completed: false };
    store.dispatch(addTodo(newTodo));
    expect(store.getState().todos).toContainEqual(newTodo);
  });

  it('should handle editTodo', () => {
    const editedTodo = { userId: 6, id: 101, title: 'Edited todo', completed: true };
    store.dispatch(editTodo(editedTodo));
    expect(store.getState().todos).toContainEqual(editedTodo);
  });

  it('should handle getTodosFromService', async () => {
    const mockTodos = [{ userId: 3, id: 201, title: 'Mock todo', completed: false }];
    global.fetch = jest.fn().mockResolvedValue({ json: () => Promise.resolve(mockTodos) });

    await store.dispatch(getTodosFromService(3));
    expect(store.getState().todos).toContainEqual(...mockTodos);
  });
});
