import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import todosSlice, { addTodo } from './features/todos/todosSlice';
import App from './App';

describe('App', () => {
  let store;

  beforeEach(() => {
    store = configureStore({ reducer: { todos: todosSlice } });
  });

  it('renders without crashing', () => {
    const { getByText } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(getByText(/Selected Todo/i)).toBeInTheDocument();
  });

  it('renders todos from initial state', () => {
    const { getByText } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(getByText(/todo found!/i)).toBeInTheDocument();
  });

  it('dispatches addTodo action on add todo button click', () => {
    const { getByText } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    fireEvent.click(getByText(/Add Todo/i));
    expect(store.getState().todos).toContainEqual({ id: 104, text: 'New todo', completed: false });
  });
});
