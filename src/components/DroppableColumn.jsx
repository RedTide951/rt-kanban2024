import React from "react";
import { useDrop } from "react-dnd";
import { Box, Card, CardContent, Typography, IconButton } from "@mui/material";
import DraggableCard from "./DraggableCard";
import DeleteIcon from "@mui/icons-material/Delete";
import Grid from "@mui/material/Grid2";

const DroppableColumn = ({
  column,
  moveTask,
  removeTask,
  updateTask,
  removeColumn,
}) => {
  const [, drop] = useDrop({
    accept: "card",
    drop(item) {
      const { index: dragIndex, columnId: sourceColumnId } = item;
      const hoverIndex = column.tasks.length; // Drop at the end
      if (sourceColumnId !== column.id) {
        moveTask(dragIndex, hoverIndex, sourceColumnId, column.id);
      }
    },
  });

  return (
    <div ref={drop}>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item size={10}>
              <Typography variant="h5">
                {column.title} ({column.tasks.length})
              </Typography>
            </Grid>
            <Grid item size={2}>
              <IconButton
                onClick={() => removeColumn(column.id)} // Delete column
                aria-label="delete"
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        </CardContent>
        <Box mt={2}>
          {column.tasks.map((task, index) => (
            <DraggableCard
              key={task.id}
              task={task}
              index={index}
              columnId={column.id}
              removeTask={removeTask}
              updateTask={updateTask}
            />
          ))}
        </Box>
      </Card>
    </div>
  );
};

export default DroppableColumn;
