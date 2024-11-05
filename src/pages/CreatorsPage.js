import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Alert,
  Snackbar,
  Avatar,
  Box,
  Skeleton,
  CircularProgress,
  Tooltip,
  Pagination,
  TableContainer,
  Paper,
  Checkbox,
  Radio,
  FormControlLabel,
  FormControl,
  FormLabel,
  RadioGroup,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import BlockIcon from "@mui/icons-material/Block";
import TickIcon from "@mui/icons-material/Check";
import CrossIcon from "@mui/icons-material/Close";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import "./styles.css"; // Import the CSS for animations

// Styled Components

const StyledTable = styled(Table)({
  tableLayout: "fixed",
  width: "100%",
});

const StyledTableCell = styled(TableCell)({
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

const FixedButton = styled(Button)({
  borderRadius: "100%",
  minWidth: "50px",
  minHeight: "50px",
});

function CreatorsPage() {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "",
  });
  const [editCreator, setEditCreator] = useState(null);
  const [newCreator, setNewCreator] = useState({
    Name: "",
    Bio: "",
    instagram_link: "",
    youtube_link: "",
    email: "",
    whatsapp: "",
    image_url: "",
    disabled: false,
  });
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [operationLoading, setOperationLoading] = useState({});
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    fetchCreators(page, rowsPerPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchCreators = async (currentPage, perPage) => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://x8ki-letl-twmt.n7.xano.io/api:oQZVUURK/creators_table",
        {
          headers: { Authorization: `Bearer ${authToken}` },
          params: { page: currentPage, limit: perPage },
        }
      );
      setCreators(response.data.items);
      setTotalItems(response.data.itemsTotal);
    } catch (error) {
      showAlert("Error fetching creators", "error");
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, severity) => {
    setAlert({ open: true, message, severity });
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  const handleOpen = (creator = null) => {
    setEditCreator(creator);
    setNewCreator(
      creator
        ? creator
        : {
            Name: "",
            Bio: "",
            instagram_link: "",
            youtube_link: "",
            email: "",
            whatsapp: "",
            image_url: "",
            disabled: false,
          }
    );
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCreator((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setOperationLoading((prev) => ({ ...prev, save: true }));
    try {
      if (editCreator) {
        await axios.put(
          `https://x8ki-letl-twmt.n7.xano.io/api:oQZVUURK/creators_table/${editCreator.id}`,
          newCreator,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        showAlert("Creator updated successfully!", "success");
      } else {
        await axios.post(
          "https://x8ki-letl-twmt.n7.xano.io/api:oQZVUURK/creators_table",
          newCreator,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        showAlert("Creator added successfully!", "success");
      }
      fetchCreators(page, rowsPerPage);
      handleClose();
    } catch (error) {
      showAlert("Error saving creator", "error");
    } finally {
      setOperationLoading((prev) => ({ ...prev, save: false }));
    }
  };

  const handleDelete = async (id) => {
    setOperationLoading((prev) => ({ ...prev, [id]: true }));
    try {
      await axios.delete(
        `https://x8ki-letl-twmt.n7.xano.io/api:oQZVUURK/creators_table/${id}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      showAlert("Creator deleted successfully!", "success");
      fetchCreators(page, rowsPerPage);
    } catch (error) {
      showAlert("Error deleting creator", "error");
    } finally {
      setOperationLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  return (
    <Container
      maxWidth="xl"
      marginTop={4}
      sx={{ position: "relative", minHeight: "70%" }}
    >
      {/* <Typography variant="h4" gutterBottom align="center" sx={{ mt: 4 }}>
        Creators
      </Typography> */}

      {/* Table */}
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <StyledTable stickyHeader aria-label="creators table">
          <TableHead>
            <TableRow>
              <StyledTableCell width="50px">Image</StyledTableCell>
              <StyledTableCell width="100px">Name</StyledTableCell>
              <StyledTableCell width="250px">Bio</StyledTableCell>
              <StyledTableCell width="30px">Instagram</StyledTableCell>
              <StyledTableCell width="30px">YouTube</StyledTableCell>
              <StyledTableCell width="200px">Email</StyledTableCell>
              <StyledTableCell width="100px">WhatsApp</StyledTableCell>
              <StyledTableCell width="100px" align="center">
                Actions
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              Array.from(new Array(rowsPerPage)).map((_, index) => (
                <TableRow key={index}>
                  {Array.from(new Array(8)).map((_, cellIndex) => (
                    <StyledTableCell key={cellIndex}>
                      <Skeleton variant="rounded" width="100%" height={15} />
                    </StyledTableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TransitionGroup component={null}>
                {creators.map((creator) => {
                  const isProcessing = operationLoading[creator.id];
                  return (
                    <CSSTransition
                      key={creator.id}
                      timeout={300}
                      classNames="row"
                    >
                      <TableRow
                        sx={{
                          height: "5px",
                          backgroundColor: creator.disabled
                            ? "#fcf1eb"
                            : "#ecfceb",
                          transition: "background-color 0.3s ease",
                          "&:hover": { backgroundColor: "action.hover" },
                        }}
                      >
                        <StyledTableCell>
                          <Avatar
                            src={creator.image_url}
                            alt={creator.Name}
                            sx={{ width: 50, height: 50 }}
                            variant="round"
                          />
                        </StyledTableCell>
                        <StyledTableCell>{creator.Name}</StyledTableCell>
                        <StyledTableCell>{creator.Bio}</StyledTableCell>
                        <StyledTableCell>
                          <a
                            href={creator.instagram_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: "none", color: "#E4405F" }}
                          >
                            IG
                          </a>
                        </StyledTableCell>
                        <StyledTableCell>
                          <a
                            href={creator.youtube_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: "none", color: "#FF0000" }}
                          >
                            YT
                          </a>
                        </StyledTableCell>
                        <StyledTableCell>{creator.email}</StyledTableCell>
                        <StyledTableCell>{creator.whatsapp}</StyledTableCell>

                        <StyledTableCell align="center">
                          {/* <Tooltip title="disable">
                            <span>
                              <IconButton
                                color="primary"
                                disabled={isProcessing || creator.disabled}
                              >
                                <BlockIcon />
                              </IconButton>
                            </span>
                          </Tooltip> */}

                          <Tooltip title="Edit">
                            <span>
                              <IconButton
                                color="primary"
                                onClick={() => handleOpen(creator)}
                                disabled={isProcessing}
                              >
                                <EditIcon />
                              </IconButton>
                            </span>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <span>
                              <IconButton
                                color="secondary"
                                onClick={() => handleDelete(creator.id)}
                                disabled={isProcessing}
                              >
                                {isProcessing ? (
                                  <CircularProgress size={24} />
                                ) : (
                                  <DeleteIcon />
                                )}
                              </IconButton>
                            </span>
                          </Tooltip>
                        </StyledTableCell>
                      </TableRow>
                    </CSSTransition>
                  );
                })}
              </TransitionGroup>
            )}
          </TableBody>
        </StyledTable>
      </TableContainer>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination
          count={Math.ceil(totalItems / rowsPerPage)}
          page={page}
          onChange={handleChangePage}
          color="primary"
        />
      </Box>

      {/* Add Creator Button */}
      <Box
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 1000,
        }}
      >
        <Tooltip title="Add Creator">
          <FixedButton
            variant="contained"
            color="primary"
            onClick={() => handleOpen()}
            startIcon={<AddIcon />}
          />
        </Tooltip>
      </Box>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          <Box display="flex" alignItems="center" flexDirection="column">
            <Typography variant="h5" gutterBottom>
              {editCreator ? "Edit Creator" : "Add New Creator"}
            </Typography>
            <Box position="relative" display="inline-block">
              <Avatar
                src={newCreator.image_url}
                alt="Profile Preview"
                sx={{ width: 100, height: 100 }}
                variant="rounded"
              />
              {/* <label htmlFor="upload-photo">
                <input
                  accept="image/*"
                  id="upload-photo"
                  type="file"
                  name="image_url"
                  onChange={handleChange}
                  style={{ display: "none" }}
                />
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    bgcolor: "background.paper",
                    borderRadius: "50%",
                    padding: "4px",
                  }}
                >
                  <PhotoCamera />
                </IconButton>
              </label> */}
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mt: 2,
            }}
          >
            <TextField
              label="Name"
              name="Name"
              value={newCreator.Name}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              required
            />
            <TextField
              label="Bio"
              name="Bio"
              value={newCreator.Bio}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              required
            />
            <TextField
              label="Instagram Link"
              name="instagram_link"
              value={newCreator.instagram_link}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              type="url"
            />
            <TextField
              label="YouTube Link"
              name="youtube_link"
              value={newCreator.youtube_link}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              type="url"
            />
            <TextField
              label="Email"
              name="email"
              value={newCreator.email}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              type="email"
              required
            />
            <TextField
              label="WhatsApp"
              name="whatsapp"
              value={newCreator.whatsapp}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              type="tel"
            />
            <TextField
              label="Image URL"
              name="image_url"
              value={newCreator.image_url}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              type="url"
            />

            {/* Radio Button Group for Disabled */}
            <FormControl component="fieldset">
              <FormLabel component="legend">Status</FormLabel>
              <RadioGroup
                row
                aria-label="status"
                name="disabled"
                value={newCreator.disabled.toString()}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="false"
                  control={<Radio color="primary" />}
                  label="Enable"
                />
                <FormControlLabel
                  value="true"
                  control={<Radio color="secondary" />}
                  label="Disable"
                />
              </RadioGroup>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            color="secondary"
            variant="outlined"
            disabled={operationLoading.save}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            color="primary"
            variant="contained"
            disabled={operationLoading.save}
            startIcon={
              operationLoading.save ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <AddIcon />
              )
            }
          >
            {editCreator ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Snackbar for Alerts */}
      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alert.severity}
          variant="filled"
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default CreatorsPage;
