import React from "react";
import { Typography, TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";

const HeadTitle = () => {
  return (
    <div>
      <Typography variant="h1">Kanban Board</Typography>
      <Grid container spacing={2}>
        <Grid size={6}>
          <TextField
            fullWidth
            id="project-name"
            placeholder="Project Name"
            variant="standard"
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default HeadTitle;
