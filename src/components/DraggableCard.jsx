import React, { useState } from "react";
import { useDrag } from "react-dnd";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  TextField,
  Button,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

const DraggableCard = ({ task, index, columnId, removeTask, updateTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [labels, setLabels] = useState(task.labels || []);

  const [{ isDragging }, drag] = useDrag({
    type: "card",
    item: { index, columnId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleAddLabel = () => {
    setLabels([...labels, { name: "", color: "#000000" }]);
  };

  const handleLabelChange = (index, field, value) => {
    const updatedLabels = labels.map((label, i) =>
      i === index ? { ...label, [field]: value } : label
    );
    setLabels(updatedLabels);
  };

  const saveChanges = () => {
    updateTask(columnId, task.id, title, description, labels);
    setIsEditing(false);
  };

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <Card sx={{ mt: 1 }}>
        <CardContent>
          {isEditing ? (
            <>
              <TextField
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                multiline
                rows={2}
              />
              <Box mt={2}>
                {labels.map((label, index) => (
                  <Box key={index} sx={{ display: "flex", mb: 1 }}>
                    <TextField
                      label="Label Name"
                      value={label.name}
                      onChange={(e) =>
                        handleLabelChange(index, "name", e.target.value)
                      }
                      sx={{ mr: 1 }}
                    />
                    <TextField
                      label="Color"
                      type="color"
                      value={label.color}
                      onChange={(e) =>
                        handleLabelChange(index, "color", e.target.value)
                      }
                    />
                  </Box>
                ))}
                <Button onClick={handleAddLabel}>Add Label</Button>
              </Box>
              <IconButton onClick={saveChanges} aria-label="save">
                <SaveIcon />
              </IconButton>
            </>
          ) : (
            <>
              <Typography variant="h6">{task.title}</Typography>
              <Typography>{task.description}</Typography>
              <Box mt={2}>
                {task.labels &&
                  task.labels.map((label, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "inline-block",
                        backgroundColor: label.color,
                        color: "#fff",
                        padding: "2px 8px",
                        marginRight: "8px",
                        borderRadius: "4px",
                      }}
                    >
                      {label.name}
                    </Box>
                  ))}
              </Box>
              <IconButton onClick={() => setIsEditing(true)} aria-label="edit">
                <EditIcon />
              </IconButton>
            </>
          )}
        </CardContent>
        <IconButton
          onClick={() => removeTask(columnId, task.id)}
          aria-label="delete"
        >
          <DeleteIcon />
        </IconButton>
      </Card>
    </div>
  );
};

export default DraggableCard;
