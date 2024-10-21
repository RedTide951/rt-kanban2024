import React, { useState, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Card,
  CardContent,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import DeleteIcon from "@mui/icons-material/Delete";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DroppableColumn from "./DroppableColumn";

// Initial column data
const initialColumns = [
  { id: "todo", title: "To-Do", tasks: [], taskTitle: "", taskDescription: "" },
  {
    id: "inprogress",
    title: "In Progress",
    tasks: [],
    taskTitle: "",
    taskDescription: "",
  },
  { id: "done", title: "Done", tasks: [], taskTitle: "", taskDescription: "" },
];

const Columns = () => {
  const [columns, setColumns] = useState(initialColumns);
  const [newColumnTitle, setNewColumnTitle] = useState("");

  const addNewColumn = () => {
    if (newColumnTitle) {
      const newColumn = {
        id: new Date().getTime().toString(),
        title: newColumnTitle,
        tasks: [],
      };
      setColumns([...columns, newColumn]);
      setNewColumnTitle("");
    }
  };

  // Delete column
  const removeColumn = (columnId) => {
    const updatedColumns = columns.filter((column) => column.id !== columnId);
    setColumns(updatedColumns);
  };

  // Add task to column
  const addTaskToColumn = (columnId) => {
    const updatedColumns = columns.map((column) => {
      if (
        column.id === columnId &&
        column.taskTitle &&
        column.taskDescription
      ) {
        const newTask = {
          id: new Date().getTime().toString(),
          title: column.taskTitle,
          description: column.taskDescription,
        };
        return {
          ...column,
          tasks: [...column.tasks, newTask],
          taskTitle: "",
          taskDescription: "",
        };
      }
      return column;
    });
    setColumns(updatedColumns);
  };

  // Move task between columns
  const moveTask = useCallback(
    (dragIndex, hoverIndex, sourceColumnId, targetColumnId) => {
      const sourceColumn = columns.find((col) => col.id === sourceColumnId);
      const targetColumn = columns.find((col) => col.id === targetColumnId);
      const task = sourceColumn.tasks[dragIndex];

      // Remove task from source column and add to target column
      const updatedSourceTasks = [...sourceColumn.tasks];
      updatedSourceTasks.splice(dragIndex, 1);

      const updatedTargetTasks = [...targetColumn.tasks];
      updatedTargetTasks.splice(hoverIndex, 0, task);

      const updatedColumns = columns.map((col) => {
        if (col.id === sourceColumnId) {
          return { ...col, tasks: updatedSourceTasks };
        }
        if (col.id === targetColumnId) {
          return { ...col, tasks: updatedTargetTasks };
        }
        return col;
      });

      setColumns(updatedColumns);
    },
    [columns]
  );

  // Remove task from column
  const removeTaskFromColumn = (columnId, taskId) => {
    const updatedColumns = columns.map((column) => {
      if (column.id === columnId) {
        const updatedTasks = column.tasks.filter((task) => task.id !== taskId);
        return { ...column, tasks: updatedTasks };
      }
      return column;
    });
    setColumns(updatedColumns);
  };

  // Update task

  const updateTask = (
    columnId,
    taskId,
    newTitle,
    newDescription,
    newLabels
  ) => {
    const updatedColumns = columns.map((column) => {
      if (column.id === columnId) {
        const updatedTasks = column.tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                title: newTitle,
                description: newDescription,
                labels: newLabels,
              }
            : task
        );
        return { ...column, tasks: updatedTasks };
      }
      return column;
    });
    setColumns(updatedColumns);
  };

  // Handle column title, task title and description changes
  const handleTaskTitleChange = (e, columnId) => {
    setColumns(
      columns.map((col) =>
        col.id === columnId ? { ...col, taskTitle: e.target.value } : col
      )
    );
  };

  const handleTaskDescriptionChange = (e, columnId) => {
    setColumns(
      columns.map((col) =>
        col.id === columnId ? { ...col, taskDescription: e.target.value } : col
      )
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        <Grid container spacing={2}>
          {columns.map((column) => (
            <Grid item xs={4} size={4} key={column.id}>
              <Card>
                <DroppableColumn
                  column={column}
                  moveTask={moveTask}
                  removeTask={removeTaskFromColumn}
                  updateTask={updateTask}
                  removeColumn={removeColumn}
                />
                <Box mt={2}>
                  <TextField
                    label="Task Title"
                    variant="outlined"
                    value={column.taskTitle}
                    onChange={(e) => handleTaskTitleChange(e, column.id)}
                    fullWidth
                  />
                  <TextField
                    label="Task Description"
                    variant="outlined"
                    value={column.taskDescription}
                    onChange={(e) => handleTaskDescriptionChange(e, column.id)}
                    fullWidth
                    multiline
                    rows={2}
                    sx={{ mt: 2 }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => addTaskToColumn(column.id)}
                    sx={{ mt: 2 }}
                  >
                    Add Task
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </DndProvider>
  );
};

export default Columns;
