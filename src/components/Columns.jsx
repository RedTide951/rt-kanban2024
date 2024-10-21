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
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

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

  // delete column
  const removeColumn = (id) => {
    const updatedColumns = columns.filter((column) => column.id !== id);
    setColumns(updatedColumns);
  };

  // Add task
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

  // Handle drag and drop

  const handleOnDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      const column = columns.find((col) => col.id === source.droppableId);
      const reorderedTasks = Array.from(column.tasks);
      const [removed] = reorderedTasks.splice(source.index, 1);
      reorderedTasks.splice(destination.index, 0, removed);

      const updatedColumns = columns.map((col) => {
        if (col.id === source.droppableId) {
          return { ...col, tasks: reorderedTasks };
        }
        return col;
      });

      setColumns(updatedColumns);
    } else {
      const sourceColumn = columns.find((col) => col.id === source.droppableId);
      const destColumn = columns.find(
        (col) => col.id === destination.droppableId
      );

      const sourceTasks = Array.from(sourceColumn.tasks);
      const destTasks = Array.from(destColumn.tasks);

      const [removed] = sourceTasks.splice(source.index, 1);
      destTasks.splice(destination.index, 0, removed);

      const updatedColumns = columns.map((col) => {
        if (col.id === source.droppableId) {
          return { ...col, tasks: sourceTasks };
        }
        if (col.id === destination.droppableId) {
          return { ...col, tasks: destTasks };
        }
        return col;
      });

      setColumns(updatedColumns);
    }
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        <Grid container spacing={2}>
          {columns.map((column) => (
            <Droppable droppableId={column.id} key={column.id}>
              {(provided) => (
                <Grid
                  item
                  xs={12}
                  md={4}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
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
                        value={column.taskTitle} // Independent state per column
                        onChange={(e) =>
                          setColumns(
                            columns.map((col) =>
                              col.id === column.id
                                ? { ...col, taskTitle: e.target.value }
                                : col
                            )
                          )
                        }
                        fullWidth
                      />
                      <TextField
                        label="Task Description"
                        variant="outlined"
                        value={column.taskDescription} // Independent state per column
                        onChange={(e) =>
                          setColumns(
                            columns.map((col) =>
                              col.id === column.id
                                ? { ...col, taskDescription: e.target.value }
                                : col
                            )
                          )
                        }
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

                    <Box mt={2}>
                      {column.tasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={snapshot.isDragging ? "dragging" : ""}
                              sx={{ mt: 1 }}
                            >
                              <CardContent>
                                <Typography variant="h6">
                                  {task.title}
                                </Typography>
                                <Typography>{task.description}</Typography>
                              </CardContent>
                              <IconButton
                                onClick={() =>
                                  removeTaskFromColumn(column.id, task.id)
                                }
                                aria-label="delete"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </Box>
                  </Card>
                </Grid>
              )}
            </Droppable>
          ))}
        </Grid>

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
