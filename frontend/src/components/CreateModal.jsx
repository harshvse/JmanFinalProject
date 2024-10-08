import React, { useState } from "react";
import { Modal, Box, Button, TextField, Typography } from "@mui/material";
import { fetchWrapper } from "../helpers";
import styles from "./styles/CreateModal.module.css";
// Modal styling
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "8px",
};

const CreateModal = ({ open, type, handleClose }) => {
  const [name, setName] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the POST request body
    const data = {
      name,
      type,
    };

    try {
      const nameData = await fetchWrapper.post(
        `${import.meta.env.VITE_API_URL}/v1/api/admin/create${type}`,
        { name }
      );
      console.log(`New ${type} ${nameData} created`);
    } catch (error) {
      console.error("Error submitting the form", error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} className={styles.container}>
      <Box sx={modalStyle}>
        <Typography variant="h6" component="h2" gutterBottom>
          {`Create New ${type === "Team" ? "Team" : "Department"}`}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label={`Enter ${type === "Team" ? "Team" : "Department"} Name`}
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            sx={{
              mb: 2,
              input: { color: "red" }, // Text color
              label: { color: "var(--secondary)" },
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused": {
                  "& fieldset": {
                    borderColor: "var(--secondary)", // Change the border color on focus
                  },
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "var(--secondary)", // Change the label color on focus
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "var(--dark)",
              "&:hover": {
                backgroundColor: "var(--lightDark)", // Change hover color
              },
            }}
          >
            Submit
          </Button>
          <Button
            onClick={handleClose}
            variant="outlined"
            style={{ marginLeft: 10 }}
            sx={{
              borderColor: "var(--dark)", // Normal border color
              color: "var(--dark)", // Text color
              "&:hover": {
                borderColor: "var(--primary)", // Border color on hover
              },
            }}
          >
            Cancel
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default CreateModal;
