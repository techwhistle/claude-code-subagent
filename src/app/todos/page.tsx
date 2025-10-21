'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, signOut } from '@/lib/auth';
import { getTodos, createTodo, deleteTodo, toggleTodo } from '@/lib/todos';
import { Todo } from '@/lib/supabase';

type FilterType = 'all' | 'active' | 'completed';

export default function TodosPage() {
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    loadUserAndTodos();
  }, []);

  const loadUserAndTodos = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUserEmail(user.email || '');
      setUserId(user.id);
      const todosData = await getTodos(user.id);
      setTodos(todosData);
    } catch (error) {
      console.error('Error loading todos:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim() || !userId) return;

    try {
      const newTodo = await createTodo(userId, newTodoTitle.trim());
      setTodos([newTodo, ...todos]);
      setNewTodoTitle('');
    } catch (error) {
      console.error('Error creating todo:', error);
      alert(error instanceof Error ? error.message : 'Failed to create todo');
    }
  };

  const handleToggleTodo = async (id: string, completed: boolean) => {
    if (!userId) return;

    try {
      await toggleTodo(userId, id, !completed);
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !completed } : todo
        )
      );
    } catch (error) {
      console.error('Error toggling todo:', error);
      alert('Failed to update todo');
    }
  };

  const handleDeleteTodo = async (id: string) => {
    if (!userId) return;

    try {
      await deleteTodo(userId, id);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
      alert('Failed to delete todo');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeTodosCount = todos.filter((todo) => !todo.completed).length;
  const completedTodosCount = todos.filter((todo) => todo.completed).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Todos</h1>
              <p className="text-sm text-gray-600 mt-1">{userEmail}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign Out
            </button>
          </div>

          {/* Add Todo Form */}
          <div className="px-6 py-4 border-b border-gray-200">
            <form onSubmit={handleAddTodo} className="flex gap-2">
              <input
                type="text"
                value={newTodoTitle}
                onChange={(e) => setNewTodoTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-medium"
              >
                Add
              </button>
            </form>
          </div>

          {/* Filter Tabs */}
          <div className="px-6 py-3 border-b border-gray-200 flex gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                filter === 'all'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All ({todos.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                filter === 'active'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Active ({activeTodosCount})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                filter === 'completed'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Completed ({completedTodosCount})
            </button>
          </div>

          {/* Todo List */}
          <div className="divide-y divide-gray-200">
            {filteredTodos.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500">
                {filter === 'all' && 'No todos yet. Add one above!'}
                {filter === 'active' && 'No active todos'}
                {filter === 'completed' && 'No completed todos'}
              </div>
            ) : (
              filteredTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="px-6 py-4 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleTodo(todo.id, todo.completed)}
                    className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <span
                    className={`flex-1 text-gray-900 ${
                      todo.completed
                        ? 'line-through text-gray-500'
                        : ''
                    }`}
                  >
                    {todo.title}
                  </span>
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Stats */}
          {todos.length > 0 && (
            <div className="px-6 py-3 bg-gray-50 text-sm text-gray-600">
              {activeTodosCount} {activeTodosCount === 1 ? 'item' : 'items'} left
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
