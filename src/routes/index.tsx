import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback, FormEvent, KeyboardEvent } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Task Manager" },
      { name: "description", content: "A simple task manager for tracking your to-dos." },
      { property: "og:title", content: "Task Manager" },
      { property: "og:description", content: "A simple task manager for tracking your to-dos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

type Task = {
  id: number;
  title: string;
  completed: boolean;
};

type Filter = "all" | "active" | "completed";

function Index() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const addTask = useCallback(() => {
    const title = inputValue.trim();
    if (!title) return;

    setTasks((prev) => [
      ...prev,
      { id: Date.now(), title, completed: false },
    ]);
    setInputValue("");
  }, [inputValue]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    addTask();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addTask();
    }
  };

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const remainingCount = tasks.filter((task) => !task.completed).length;

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <h1 className="text-center text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Task Manager
        </h1>

        <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter a task..."
            className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Task title"
          />
          <button
            type="submit"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            Add
          </button>
        </form>

        <div className="mt-4 flex justify-center gap-2">
          {(["all", "active", "completed"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-md px-3 py-1 text-sm font-medium capitalize transition-colors focus:outline-none focus:ring-2 focus:ring-ring ${
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
              aria-pressed={filter === f}
            >
              {f}
            </button>
          ))}
        </div>

        <ul className="mt-6 space-y-2" aria-label="Tasks">
          {filteredTasks.length === 0 ? (
            <li className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
              No tasks to show.
            </li>
          ) : (
            filteredTasks.map((task) => (
              <li
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`cursor-pointer rounded-lg border border-border px-4 py-3 text-sm transition-colors hover:bg-accent ${
                  task.completed
                    ? "text-muted-foreground line-through"
                    : "text-foreground"
                }`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleTask(task.id);
                  }
                }}
                aria-pressed={task.completed}
              >
                {task.title}
              </li>
            ))
          )}
        </ul>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {remainingCount} task{remainingCount === 1 ? "" : "s"} remaining
        </p>
      </div>
    </div>
  );
}
