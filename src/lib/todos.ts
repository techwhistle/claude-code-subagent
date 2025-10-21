import { supabase, Todo } from './supabase';
import { isValidUUID, validateTodoTitle, sanitizeTodoTitle } from './validation';

export async function getTodos(userId: string): Promise<Todo[]> {
  // Validate userId is a valid UUID
  if (!isValidUUID(userId)) {
    throw new Error('Invalid user ID format');
  }

  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createTodo(userId: string, title: string): Promise<Todo> {
  // Validate inputs
  if (!isValidUUID(userId)) {
    throw new Error('Invalid user ID format');
  }

  const validation = validateTodoTitle(title);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Sanitize the title to prevent XSS
  const sanitizedTitle = sanitizeTodoTitle(title);

  const { data, error } = await supabase
    .from('todos')
    .insert({ user_id: userId, title: sanitizedTitle, completed: false })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateTodo(userId: string, id: string, updates: Partial<Todo>): Promise<Todo> {
  // Validate IDs
  if (!isValidUUID(userId) || !isValidUUID(id)) {
    throw new Error('Invalid ID format');
  }

  // If updating title, validate and sanitize it
  if (updates.title) {
    const validation = validateTodoTitle(updates.title);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    updates.title = sanitizeTodoTitle(updates.title);
  }

  const { data, error } = await supabase
    .from('todos')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId) // Explicitly verify ownership
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteTodo(userId: string, id: string): Promise<void> {
  // Validate IDs
  if (!isValidUUID(userId) || !isValidUUID(id)) {
    throw new Error('Invalid ID format');
  }

  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id)
    .eq('user_id', userId); // Explicitly verify ownership

  if (error) throw error;
}

export async function toggleTodo(userId: string, id: string, completed: boolean): Promise<Todo> {
  return updateTodo(userId, id, { completed });
}
