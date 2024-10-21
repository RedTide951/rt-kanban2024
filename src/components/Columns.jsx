import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import DeleteIcon from "@mui/icons-material/Delete";
import { DragDropContext } from "react-beautiful-dnd";
import { Droppable } from "react-beautiful-dnd";

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
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");

  // add column
  const addNewColumn = () => {
    if (newColumnTitle) {
      const newColumn = {
        id: new Date().getTime().toString(),
        title: newColumnTitle,
        tasks: [],
      };
      setColumns([...columns, newColumn]);
      setNewColumnTitle(""); // Clear input after adding
    }
  };

  const handleTaskChange = (e, columnId, field) => {
    const updatedColumns = columns.map((column) => {
      if (column.id === columnId) {
        return { ...column, [field]: e.target.value };
      }
      return column;
    });
    setColumns(updatedColumns);
  };

  // delete column
  const removeColumn = (id) => {
    const updatedColumns = columns.filter((column) => column.id !== id);
    setColumns(updatedColumns);
  };

  // Add task
  const addTaskToColumn = (columnId) => {
    if (taskTitle && taskDescription) {
      const newTask = {
        id: new Date().getTime().toString(),
        title: taskTitle,
        description: taskDescription,
      };
      const updatedColumns = columns.map((column) => {
        if (column.id === columnId) {
          return { ...column, tasks: [...column.tasks, newTask] };
        }
        return column;
      });
      setColumns(updatedColumns);
      setTaskTitle("");
      setTaskDescription("");
    }
  };

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

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        <Grid container spacing={2}>
          {columns.map((column) => (
            <Grid item xs={2} size={3} key={column.id}>
              <Card>
                <CardContent>
                  <Typography variant="h5">{column.title}</Typography>
                  <IconButton
                    onClick={() => removeColumn(column.id)}
                    aria-label="delete"
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardContent>

                <Box mt={2}>
                  <TextField
                    label="Task Title"
                    variant="outlined"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    fullWidth
                  />
                  <TextField
                    label="Task Description"
                    variant="outlined"
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
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

                {/* Display tasks in the column */}
                <Box mt={2}>
                  {column.tasks.map((task) => (
                    <Card key={task.id} sx={{ mt: 1 }}>
                      <CardContent>
                        <Typography variant="h6">{task.title}</Typography>
                        <Typography>{task.description}</Typography>
                      </CardContent>
                      <IconButton
                        onClick={() => removeTaskFromColumn(column.id, task.id)}
                        aria-label="delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Card>
                  ))}
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Form to add new columns */}
        <Box mt={2}>
          <TextField
            label="New Column Title"
            variant="outlined"
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={addNewColumn}
            sx={{ ml: 2 }}
          >
            Add Column
          </Button>
        </Box>
      </Box>
    </DragDropContext>
  );
};

export default Columns;
