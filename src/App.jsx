// src/App.jsx
import React, { useState, useEffect } from "react";

const getTimePeriod = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Morning";
  if (hour < 18) return "Afternoon";
  return "Evening";
};

const getColor = (period) => {
  switch (period) {
    case "Morning": return "#ff6b6b";
    case "Afternoon": return "#34d399";
    case "Evening": return "#60a5fa";
    default: return "black";
  }
};

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [timer, setTimer] = useState(0);

  const addTask = () => {
    if (!text.trim() || !timer) return;
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text,
        period: getTimePeriod(),
        done: false,
        deadline: Date.now() + timer * 60000
      }
    ]);
    setText("");
    setTimer(0);
  };

  const toggleDone = (id) =>
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const removeTask = (id) =>
    setTasks(tasks.filter((t) => t.id !== id));

  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-xl mx-auto p-4 font-sans">
      <h1 className="text-3xl font-bold text-center mb-6">MyDay Planner</h1>

      <div className="flex gap-2 mb-4">
        <input
          className="flex-1 p-2 border rounded"
          placeholder="What needs doing?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <input
          type="number"
          min="1"
          placeholder="Minutes"
          value={timer}
          onChange={(e) => setTimer(e.target.value)}
          className="w-24 p-2 border rounded"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={addTask}
        >
          Add
        </button>
      </div>

      <p className="text-center text-white mb-6">
        Enter how many <strong>minutes</strong> you want to finish the task in.
      </p>

      <div className="space-y-3">
        {tasks.map((task) => {
          const timeLeft = Math.max(0, Math.floor((task.deadline - now) / 1000));
          const mins = Math.floor(timeLeft / 60);
          const secs = timeLeft % 60;
          const expired = timeLeft <= 0;

          return (
            <div
              key={task.id}
              style={{
                backgroundColor: getColor(task.period),
                opacity: task.done ? 0.5 : 1,
              }}
              className="flex items-center justify-between p-3 border rounded shadow"
            >
              <div>
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleDone(task.id)}
                  className="mr-2"
                />
                <span className={task.done ? "line-through" : ""}>
                  {task.text}
                </span>
                <small className="block text-sm text-white">
                  {task.period}
                </small>
                {!task.done && (
                  <small className="block text-xs text-white mt-1">
                    {expired
                      ? "Time's up!"
                      : `Time left: ${mins}:${secs.toString().padStart(2, "0")}`}
                  </small>
                )}
              </div>
              <button
                className="text-white font-bold px-2"
                onClick={() => removeTask(task.id)}
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
