import { useEffect, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "../config/AxiosInterceptor";
import { toast } from "react-toastify";

const PropertyManagement = () => {
    const [properties, setProperties] = useState([]);
    const [updatePropertyData, setUpdatePropertyData] = useState();
    const [openAdd, setOpenAdd] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);

    // Fetch properties from backend
    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            const response = await axios.get(`/properties`);
            setProperties(response.data);
        } catch (error) {
            console.error("Error fetching properties:", error);
        }
    };

    // Open and close Add Property popup
    const handleOpenAdd = () => setOpenAdd(true);
    const handleCloseAdd = () => setOpenAdd(false);
    const handleOpenUpdate = () => setOpenUpdate(true);
    const handleCloseUpdate = () => setOpenUpdate(false);

    const handleUpdate = (property) => {
        setUpdatePropertyData(property)
        setOpenUpdate(true);
    }

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/properties/${id}`);
            toast.success(`Property deleted successfully`);
            fetchProperties(); // Refresh list
        } catch (error) {
            toast.success(`Error deleting property:`);
            console.error("Error deleting property:", error);
        }
    }

    // Add property in backend (Sending FormData)
    const handleAddProperty = async (values, { resetForm, setSubmitting }) => {
        try {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("location", values.location);
            formData.append("price", values.price);
            formData.append("builder", values.builder);
            formData.append("contact", values.contact);
            formData.append("discount", values.discount);
            formData.append("description", values.description);
            formData.append("features", values.features);
            if (values.image) {
                formData.append("image", values.image);
            }

            await axios.post(`/properties`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            fetchProperties(); // Refresh list
            resetForm();
            handleCloseAdd();
            toast.success(`Property added successfully`);
        } catch (error) {
            toast.success(`Error adding property`);
            console.error("Error adding property:", error);
        } finally {
            setSubmitting(false);
        }
    };



    // Update property in backend (Sending FormData)
    const handleUpdateProperty = async (values, { resetForm, setSubmitting }) => {
        try {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("location", values.location);
            formData.append("price", values.price);
            formData.append("builder", values.builder);
            formData.append("contact", values.contact);
            formData.append("discount", values.discount);
            formData.append("description", values.description);
            formData.append("features", values.features);
            if (values.image) {
                formData.append("image", values.image);
            }

            await axios.put(`/properties/${updatePropertyData.id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            fetchProperties(); // Refresh list
            resetForm();
           
            toast.success(`Property updated successfully`);
        } catch (error) {
            toast.success(`Error updating property`);
            console.error("Error updating property:", error);
        } finally {
            setSubmitting(false);
            handleCloseUpdate();
        }
    };

    // Validation Schema using Yup
    const PropertySchema = Yup.object().shape({
        name: Yup.string().required("Property name is required"),
        location: Yup.string().required("Location is required"),
        price: Yup.number().required("Price is required").positive("Price must be positive"),
        builder: Yup.string().required("Builder is required"),
        contact: Yup.string()
            .matches(/^[0-9]{10}$/, "Must be a valid 10-digit number")
            .required("Contact is required"),
        discount: Yup.string().required("Discount is required"),
        description: Yup.string().required("Description is required"),
        features: Yup.string().required("Features are required"),
    });

    return (
        <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 5 }}>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" sx={{ mb: 2, color: "primary.main", fontWeight: "bold" }}>
                        Property Management
                    </Typography>
                    <Button variant="contained" onClick={handleOpenAdd}>
                        Add Property
                    </Button>
                </Box>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead sx={{ backgroundColor: "primary.light" }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: "bold", color: "white" }}>Property Name</TableCell>
                                <TableCell sx={{ fontWeight: "bold", color: "white" }}>Location</TableCell>
                                <TableCell sx={{ fontWeight: "bold", color: "white" }}>Price</TableCell>
                                <TableCell sx={{ fontWeight: "bold", color: "white" }}>Builder</TableCell>
                                <TableCell sx={{ fontWeight: "bold", color: "white" }}>Contact</TableCell>
                                <TableCell sx={{ fontWeight: "bold", color: "white" }}>Discount</TableCell>
                                <TableCell sx={{ fontWeight: "bold", color: "white" }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {properties.map((property) => (
                                <TableRow key={property.id}>
                                    <TableCell>{property.name}</TableCell>
                                    <TableCell>{property.location}</TableCell>
                                    <TableCell>{property.price}</TableCell>
                                    <TableCell>{property.builder}</TableCell>
                                    <TableCell>{property.contact}</TableCell>
                                    <TableCell>{property.discount}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="success" size="small" sx={{ mr: 1 }} onClick={()=> handleUpdate(property)}>
                                            Edit
                                        </Button>
                                        <Button variant="contained" color="error" size="small" onClick={()=> handleDelete(property.id)}>
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>

            {/* Add Property Popup */}
            <Dialog open={openAdd} onClose={handleCloseAdd} fullWidth maxWidth="sm">
                <DialogTitle>Add New Property</DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={{
                            name: "",
                            location: "",
                            price: "",
                            builder: "",
                            contact: "",
                            discount: "",
                            description: "",
                            features: "",
                            image: null,
                        }}
                        validationSchema={PropertySchema}
                        onSubmit={handleAddProperty}
                    >
                        {({ errors, touched, setFieldValue, handleChange }) => (
                            <Form>
                                <Box display="flex" flexDirection="column" gap={2} sx={{ mt: 2 }}>
                                    <Field as={TextField} label="Property Name" name="name" fullWidth error={touched.name && !!errors.name} helperText={touched.name && errors.name} />
                                    <Field as={TextField} label="Location" name="location" fullWidth error={touched.location && !!errors.location} helperText={touched.location && errors.location} />
                                    <Field as={TextField} label="Price" name="price" fullWidth error={touched.price && !!errors.price} helperText={touched.price && errors.price} />
                                    <Field as={TextField} label="Builder" name="builder" fullWidth error={touched.builder && !!errors.builder} helperText={touched.builder && errors.builder} />
                                    <Field as={TextField} label="Contact" name="contact" fullWidth error={touched.contact && !!errors.contact} helperText={touched.contact && errors.contact} />
                                    <Field as={TextField} label="Discount" name="discount" fullWidth error={touched.discount && !!errors.discount} helperText={touched.discount && errors.discount} />
                                    <Field as={TextField} label="Description" name="description" fullWidth error={touched.description && !!errors.description} helperText={touched.description && errors.description} />
                                    <Field as={TextField} label="Features" name="features" fullWidth error={touched.features && !!errors.features} helperText={touched.features && errors.features} />

                                    {/* File Input */}
                                    <input
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        onChange={(event) => setFieldValue("image", event.currentTarget.files[0])}
                                    />
                                    {errors.image && touched.image && <div style={{ color: "red" }}>{errors.image}</div>}
                                </Box>
                                <DialogActions>
                                    <Button onClick={handleCloseAdd} color="secondary">
                                        Cancel
                                    </Button>
                                    <Button type="submit" color="primary" variant="contained">
                                        Add
                                    </Button>
                                </DialogActions>
                            </Form>
                        )}
                    </Formik>
                </DialogContent>
            </Dialog>

            {/* Update Property Popup */}
            <Dialog open={openUpdate} onClose={handleCloseUpdate} fullWidth maxWidth="sm">
                <DialogTitle>Update Property</DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={{
                            name: updatePropertyData?.name,
                            location: updatePropertyData?.location,
                            price: updatePropertyData?.price,
                            builder: updatePropertyData?.builder,
                            contact: updatePropertyData?.contact,
                            discount: updatePropertyData?.discount,
                            description: updatePropertyData?.description,
                            features: updatePropertyData?.features,
                            image: updatePropertyData?.image,
                        }}
                        validationSchema={PropertySchema}
                        onSubmit={handleUpdateProperty}
                    >
                        {({ errors, touched, setFieldValue, handleChange }) => (
                            <Form>
                                <Box display="flex" flexDirection="column" gap={2} sx={{ mt: 2 }}>
                                    <Field as={TextField} label="Property Name" name="name" fullWidth error={touched.name && !!errors.name} helperText={touched.name && errors.name} />
                                    <Field as={TextField} label="Location" name="location" fullWidth error={touched.location && !!errors.location} helperText={touched.location && errors.location} />
                                    <Field as={TextField} label="Price" name="price" fullWidth error={touched.price && !!errors.price} helperText={touched.price && errors.price} />
                                    <Field as={TextField} label="Builder" name="builder" fullWidth error={touched.builder && !!errors.builder} helperText={touched.builder && errors.builder} />
                                    <Field as={TextField} label="Contact" name="contact" fullWidth error={touched.contact && !!errors.contact} helperText={touched.contact && errors.contact} />
                                    <Field as={TextField} label="Discount" name="discount" fullWidth error={touched.discount && !!errors.discount} helperText={touched.discount && errors.discount} />
                                    <Field as={TextField} label="Description" name="description" fullWidth error={touched.description && !!errors.description} helperText={touched.description && errors.description} />
                                    <Field as={TextField} label="Features" name="features" fullWidth error={touched.features && !!errors.features} helperText={touched.features && errors.features} />

                                    {/* File Input */}
                                    <input
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        onChange={(event) => setFieldValue("image", event.currentTarget.files[0])}
                                    />
                                    {errors.image && touched.image && <div style={{ color: "red" }}>{errors.image}</div>}
                                </Box>
                                <DialogActions>
                                    <Button onClick={handleCloseUpdate} color="secondary">
                                        Cancel
                                    </Button>
                                    <Button type="submit" color="primary" variant="contained">
                                        Update
                                    </Button>
                                </DialogActions>
                            </Form>
                        )}
                    </Formik>
                </DialogContent>
            </Dialog>
        </Card>
    );
};

export default PropertyManagement;
