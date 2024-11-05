// src/pages/SettingsPage.jsx

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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import PublishIcon from "@mui/icons-material/Publish";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import VisibilityIcon from "@mui/icons-material/Visibility"; // Icon for Show JSON
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

function SettingsPage() {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openPublishDialog, setOpenPublishDialog] = useState(false);
  const [selectedApiKey, setSelectedApiKey] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "",
  });
  const [operationLoading, setOperationLoading] = useState({});
  const [openJsonDialog, setOpenJsonDialog] = useState(false);
  const [jsonData, setJsonData] = useState("");
  const [jsonLoading, setJsonLoading] = useState(false);
  const [jsonError, setJsonError] = useState("");
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editApiKeyData, setEditApiKeyData] = useState({
    id: "",
    apinew: "",
  });
  const authToken = localStorage.getItem("authToken");

  const rowsPerPage = 10;
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchApiKeys(page, rowsPerPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Fetch API Keys from logintable
  const fetchApiKeys = async (currentPage, perPage) => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://x8ki-letl-twmt.n7.xano.io/api:oQZVUURK/logintable",
        {
          headers: { Authorization: `Bearer ${authToken}` },
          params: { page: currentPage, limit: perPage },
        }
      );
      setApiKeys(response.data);
      setTotalItems(response.data.length); // Adjust based on actual response
    } catch (error) {
      console.error("Error fetching API keys:", error);
      showAlert("Error fetching API keys", "error");
    } finally {
      setLoading(false);
    }
  };

  // Show Alert Snackbar
  const showAlert = (message, severity) => {
    setAlert({ open: true, message, severity });
  };

  // Close Alert Snackbar
  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  // Open Publish Dialog
  const handlePublishClick = (apiKey) => {
    setSelectedApiKey(apiKey);
    setOpenPublishDialog(true);
  };

  // Close Publish Dialog
  const handleClosePublishDialog = () => {
    setOpenPublishDialog(false);
    setSelectedApiKey(null);
  };

  // Copy API Key to Clipboard
  const handleCopyApiKey = (apiKey) => {
    navigator.clipboard.writeText(apiKey);
    showAlert("API Key copied to clipboard!", "success");
  };

  // Publish JSON Data using selected API Key
  const handlePublishJson = async () => {
    if (!selectedApiKey) {
      showAlert("No API Key selected", "error");
      return;
    }

    setOperationLoading((prev) => ({ ...prev, publish: true }));
    try {
      const response = await axios.post(
        "https://x8ki-letl-twmt.n7.xano.io/api:oQZVUURK/jsondatafetch",
        { apikey: selectedApiKey },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      // Handle response as needed

      if (response.data.api1 === 200) {
        console.log("Publish JSON Response:", response.data);
        showAlert("JSON data published successfully!", "success");
      } else {
        console.log("Publish JSON Response:", response.data);
        showAlert("Failed to publish JSON data", "error");
      }
    } catch (error) {
      console.error("Error publishing JSON data:", error);
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred.";
      showAlert(errorMessage, "error");
    } finally {
      setOperationLoading((prev) => ({ ...prev, publish: false }));
      handleClosePublishDialog();
    }
  };

  // Open JSON Dialog to Show Current JSON
  const handleShowJson = async () => {
    setJsonLoading(true);
    setJsonError("");
    try {
      const response = await axios.get(
        "https://api.jsonsilo.com/public/5a825ab4-3554-4a49-b86c-70269833f7f6"
      );
      // Assuming the response is the raw JSON data
      setJsonData(JSON.stringify(response.data, null, 2));
      setOpenJsonDialog(true);
    } catch (error) {
      console.error("Error fetching JSON data:", error);
      setJsonError("Failed to fetch JSON data.");
      showAlert("Error fetching JSON data", "error");
    } finally {
      setJsonLoading(false);
    }
  };

  // Close JSON Dialog
  const handleCloseJsonDialog = () => {
    setOpenJsonDialog(false);
    setJsonData("");
    setJsonError("");
  };

  // Copy JSON Data to Clipboard
  const handleCopyJsonData = () => {
    navigator.clipboard.writeText(jsonData);
    showAlert("JSON data copied to clipboard!", "success");
  };

  // Handle Page Change for Pagination
  const handleChangePage = (event, value) => {
    setPage(value);
  };

  // Open Edit Dialog
  const handleOpenEditDialog = (apiKeyObj) => {
    setEditApiKeyData({
      id: apiKeyObj.id,
      apinew: "", // Initialize as empty; user will input new API key
    });
    setOpenEditDialog(true);
  };

  // Close Edit Dialog
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditApiKeyData({
      id: "",
      apinew: "",
    });
  };

  // Handle Change in Edit Dialog
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditApiKeyData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Update API Key
  const handleUpdateApiKey = async () => {
    const { id, apinew } = editApiKeyData;

    if (!apinew.trim()) {
      showAlert("New API Key cannot be empty.", "error");
      return;
    }

    setOperationLoading((prev) => ({ ...prev, [id]: true }));
    try {
      await axios.put(
        `https://x8ki-letl-twmt.n7.xano.io/api:oQZVUURK/logintable/${id}`,
        { apinew },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      showAlert("API Key updated successfully!", "success");
      fetchApiKeys(page, rowsPerPage);
      handleCloseEditDialog();
    } catch (error) {
      console.error("Error updating API key:", error);
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred.";
      showAlert(errorMessage, "error");
    } finally {
      setOperationLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <Container
      maxWidth="xl"
      sx={{ position: "relative", minHeight: "100vh", paddingTop: 4 }}
    >
      <Typography variant="h4" gutterBottom align="center">
        Settings
      </Typography>

      {/* API Keys Table */}
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <StyledTable stickyHeader aria-label="API Keys table">
          <TableHead>
            <TableRow>
              <StyledTableCell width="50px">#</StyledTableCell>
              <StyledTableCell width="300px">API Key</StyledTableCell>
              <StyledTableCell width="150px">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              Array.from(new Array(rowsPerPage)).map((_, index) => (
                <TableRow key={index}>
                  {Array.from(new Array(3)).map((_, cellIndex) => (
                    <StyledTableCell key={cellIndex}>
                      <Skeleton variant="rounded" width="100%" height={15} />
                    </StyledTableCell>
                  ))}
                </TableRow>
              ))
            ) : apiKeys.length > 0 ? (
              <TransitionGroup component={null}>
                {apiKeys.map((apiKeyObj, index) => {
                  const isProcessing = operationLoading[apiKeyObj.api];
                  return (
                    <CSSTransition
                      key={apiKeyObj.id} // Use unique identifier
                      timeout={300}
                      classNames="row"
                    >
                      <TableRow
                        sx={{
                          height: "60px", // Fixed row height
                          backgroundColor:
                            index % 2 === 0 ? "#f9f9f9" : "#ffffff",
                          transition: "background-color 0.3s ease",
                          "&:hover": { backgroundColor: "#f1f1f1" },
                        }}
                      >
                        <StyledTableCell>
                          {(page - 1) * rowsPerPage + index + 1}
                        </StyledTableCell>
                        <StyledTableCell sx={{ wordBreak: "break-all" }}>
                          {apiKeyObj.api}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <Tooltip title="Publish JSON">
                            <span>
                              <IconButton
                                color="primary"
                                onClick={() =>
                                  handlePublishClick(apiKeyObj.api)
                                }
                                disabled={isProcessing}
                              >
                                <PublishIcon />
                              </IconButton>
                            </span>
                          </Tooltip>
                          <Tooltip title="Copy API Key">
                            <span>
                              <IconButton
                                color="secondary"
                                onClick={() => handleCopyApiKey(apiKeyObj.api)}
                              >
                                <ContentCopyIcon />
                              </IconButton>
                            </span>
                          </Tooltip>
                          <Tooltip title="Edit API Key">
                            <span>
                              <IconButton
                                color="info"
                                onClick={() => handleOpenEditDialog(apiKeyObj)}
                                disabled={isProcessing}
                              >
                                <EditIcon />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </StyledTableCell>
                      </TableRow>
                    </CSSTransition>
                  );
                })}
              </TransitionGroup>
            ) : (
              <TableRow>
                <StyledTableCell colSpan={3} align="center">
                  No API Keys Found.
                </StyledTableCell>
              </TableRow>
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

      {/* Action Buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 4,
          gap: 2,
        }}
      >
        {/* <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handlePublishClick(null)} // Adjust if needed
        >
          Publish JSON To Public
        </Button> */}
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<VisibilityIcon />}
          onClick={handleShowJson}
        >
          Show Current JSON
        </Button>
      </Box>

      {/* Publish JSON Dialog */}
      <Dialog
        open={openPublishDialog}
        onClose={handleClosePublishDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Publish JSON Data</DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            Are you sure you want to publish JSON data using the selected API
            key?
          </Typography>
          {selectedApiKey && (
            <Box display="flex" alignItems="center" mt={2}>
              <Avatar
                src=""
                alt="API Key"
                sx={{ width: 40, height: 40, mr: 2 }}
              />
              <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
                {selectedApiKey}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClosePublishDialog}
            color="secondary"
            variant="outlined"
            disabled={operationLoading.publish}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePublishJson}
            color="primary"
            variant="contained"
            disabled={operationLoading.publish}
            startIcon={
              operationLoading.publish ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <PublishIcon />
              )
            }
          >
            Publish
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit API Key Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit API Key</DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            Enter the new API Key for the selected entry.
          </Typography>
          <TextField
            label="New API Key"
            name="apinew"
            value={editApiKeyData.apinew}
            onChange={handleEditChange}
            variant="outlined"
            fullWidth
            required
            margin="normal"
            helperText="Enter a valid API key."
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseEditDialog}
            color="secondary"
            variant="outlined"
            disabled={operationLoading[editApiKeyData.id]}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateApiKey}
            color="primary"
            variant="contained"
            disabled={operationLoading[editApiKeyData.id]}
            startIcon={
              operationLoading[editApiKeyData.id] ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <EditIcon />
              )
            }
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Show Current JSON Dialog */}
      <Dialog
        open={openJsonDialog}
        onClose={handleCloseJsonDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Current JSON Data</DialogTitle>
        <DialogContent dividers>
          {jsonLoading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="200px"
            >
              <CircularProgress />
            </Box>
          ) : jsonError ? (
            <Alert severity="error">{jsonError}</Alert>
          ) : (
            <Box
              component="pre"
              sx={{
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
                backgroundColor: "#f5f5f5",
                padding: 2,
                borderRadius: 1,
                maxHeight: "400px",
                overflowY: "auto",
              }}
            >
              {jsonData}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCopyJsonData}
            color="primary"
            variant="contained"
            disabled={!jsonData || jsonLoading}
            startIcon={<ContentCopyIcon />}
          >
            Copy JSON
          </Button>
          <Button
            onClick={handleCloseJsonDialog}
            color="secondary"
            variant="outlined"
            disabled={jsonLoading}
          >
            Close
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

export default SettingsPage;
