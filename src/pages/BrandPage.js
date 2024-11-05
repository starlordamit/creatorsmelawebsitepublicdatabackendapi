// src/pages/BrandPage.jsx
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
import PhotoCamera from "@mui/icons-material/PhotoCamera";
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
  borderRadius: "50%",
  minWidth: "50px",
  minHeight: "50px",
});

function BrandPage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "",
  });
  const [editBrand, setEditBrand] = useState(null);
  const [newBrand, setNewBrand] = useState({
    Name: "",
    about: "",
    image_url: "",
    disabled: false,
  });
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [operationLoading, setOperationLoading] = useState({});
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    fetchBrands(page, rowsPerPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchBrands = async (currentPage, perPage) => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://x8ki-letl-twmt.n7.xano.io/api:oQZVUURK/brands_table",
        {
          headers: { Authorization: `Bearer ${authToken}` },
          params: { page: currentPage, limit: perPage },
        }
      );
      setBrands(response.data.items);
      setTotalItems(response.data.itemsTotal);
    } catch (error) {
      showAlert("Error fetching brands", "error");
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

  const handleOpen = (brand = null) => {
    setEditBrand(brand);
    setNewBrand(
      brand
        ? {
            Name: brand.Name,
            about: brand.about,
            image_url: brand.image_url,
            disabled: brand.disabled,
          }
        : {
            Name: "",
            about: "",
            image_url: "",
            disabled: false,
          }
    );
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image_url" && files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewBrand((prev) => ({ ...prev, image_url: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      setNewBrand((prev) => ({
        ...prev,
        [name]: name === "disabled" ? value === "true" : value,
      }));
    }
  };

  const handleSave = async () => {
    setOperationLoading((prev) => ({ ...prev, save: true }));
    try {
      if (editBrand) {
        await axios.put(
          `https://x8ki-letl-twmt.n7.xano.io/api:oQZVUURK/brands_table/${editBrand.id}`,
          newBrand,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        showAlert("Brand updated successfully!", "success");
      } else {
        await axios.post(
          "https://x8ki-letl-twmt.n7.xano.io/api:oQZVUURK/brands_table",
          newBrand,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        showAlert("Brand added successfully!", "success");
      }
      fetchBrands(page, rowsPerPage);
      handleClose();
    } catch (error) {
      console.error("Error saving brand:", error);
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred.";
      showAlert(errorMessage, "error");
    } finally {
      setOperationLoading((prev) => ({ ...prev, save: false }));
    }
  };

  const handleDelete = async (id) => {
    setOperationLoading((prev) => ({ ...prev, [id]: true }));
    try {
      await axios.delete(
        `https://x8ki-letl-twmt.n7.xano.io/api:oQZVUURK/brands_table/${id}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      showAlert("Brand deleted successfully!", "success");
      fetchBrands(page, rowsPerPage);
    } catch (error) {
      console.error("Error deleting brand:", error);
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred.";
      showAlert(errorMessage, "error");
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
      sx={{ position: "relative", minHeight: "100vh", paddingTop: 4 }}
    >
      <Typography variant="h4" gutterBottom align="center">
        Brands
      </Typography>

      {/* Table */}
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <StyledTable stickyHeader aria-label="brands table">
          <TableHead>
            <TableRow>
              <StyledTableCell width="100px">Image</StyledTableCell>
              <StyledTableCell width="150px">Name</StyledTableCell>
              <StyledTableCell width="300px">About</StyledTableCell>
              <StyledTableCell width="100px">Status</StyledTableCell>
              <StyledTableCell width="120px" align="center">
                Actions
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              Array.from(new Array(rowsPerPage)).map((_, index) => (
                <TableRow key={index}>
                  {Array.from(new Array(5)).map((_, cellIndex) => (
                    <StyledTableCell key={cellIndex}>
                      <Skeleton variant="rounded" width="100%" height={15} />
                    </StyledTableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TransitionGroup component={null}>
                {brands.map((brand) => {
                  const isProcessing = operationLoading[brand.id];
                  return (
                    <CSSTransition
                      key={brand.id}
                      timeout={300}
                      classNames="row"
                    >
                      <TableRow
                        sx={{
                          height: "60px", // Fixed row height
                          backgroundColor: brand.disabled
                            ? "#fcf1eb"
                            : "#ecfceb",
                          transition: "background-color 0.3s ease",
                          "&:hover": { backgroundColor: "action.hover" },
                        }}
                      >
                        <StyledTableCell>
                          <Avatar
                            src={brand.image_url}
                            alt={brand.Name}
                            sx={{ width: "auto", height: "auto" }}
                            variant="rounded"
                          />
                        </StyledTableCell>
                        <StyledTableCell>{brand.Name}</StyledTableCell>
                        <StyledTableCell>{brand.about}</StyledTableCell>
                        <StyledTableCell>
                          {brand.disabled ? "Disabled" : "Enabled"}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <Tooltip title="Edit">
                            <span>
                              <IconButton
                                color="primary"
                                onClick={() => handleOpen(brand)}
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
                                onClick={() => handleDelete(brand.id)}
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

      {/* Add Brand Button */}
      <Box
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 1000,
        }}
      >
        <Tooltip title="Add Brand">
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
              {editBrand ? "Edit Brand" : "Add New Brand"}
            </Typography>
            <Box position="relative" display="inline-block">
              <Avatar
                src={newBrand.image_url}
                alt="Profile Preview"
                sx={{ width: "100%", height: 50 }}
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
              value={newBrand.Name}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              required
            />
            <TextField
              label="About"
              name="about"
              value={newBrand.about}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              required
            />
            <TextField
              label="Image URL"
              name="image_url"
              value={newBrand.image_url}
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
                value={newBrand.disabled.toString()}
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
            {editBrand ? "Update" : "Add"}
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

export default BrandPage;
