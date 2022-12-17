import React from 'react'
import axios from 'axios'
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

let baseUrl = '';
if (window.location.href.split(':')[0] === 'http') {
    baseUrl = 'http://localhost:5001';
}

const ViewProducts = () => {

    const [allProducts, setAllProducts] = useState([]);
    const [open, setOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [severity, setSeverity] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadProduct, setLoadProduct] = useState(false)

    const handleClick = (message, severity) => {
        setOpen(true);
        setAlertMessage(message);
        setSeverity(severity);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlertMessage("");
        setOpen(false);
        setSeverity("");
    };

    const [openModal, setOpenModal] = React.useState(false);

    const handleClickModal = (product) => {
        formik.setFieldValue("id", product.id);
        formik.setFieldValue("name", product.name);
        formik.setFieldValue("price", product.price);
        formik.setFieldValue("description", product.description);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    useEffect(() => {
        getAllProducts()
    }, [loadProduct])

    const formik = useFormik({
        initialValues: {
            id: "",
            name: "",
            price: "",
            description: ""
        },
        validationSchema: yup.object({
            name: yup
                .string('Enter Product Name')
                .required('Product Name is required'),
            price: yup
                .number('Enter Price')
                .min(0, "Price Should be greater than 0 or equal to 0")
                .required('Price is required'),
            description: yup
                .string("Enter Product Description")
                .required("Description is required"),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            axios.put(`${baseUrl}/product/${values.id}`, {
                name: values.name,
                price: values.price,
                description: values.description,
            })
                .then(response => {
                    console.log("Editing Product: ", response.data);
                    setLoading(false);
                    response.data.added ? handleClick("Product Edited Successfully", "success") : handleClick("Error Editing Products", "error");
                })
                .catch(err => {
                    console.log("Editing Products Error: ", err);
                    setLoading(false);
                    handleClick("Error Editing Products", "error");
                })
            setLoadProduct(!loadProduct);
            handleCloseModal();
        }
    })

    const getAllProducts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/products`)
            setLoading(false);
            console.log("Fetching Products: ", response.data);
            setAllProducts(response.data.data)
            response.data.data.length === 0 && handleClick("No Products Found", "warning");
        } catch (error) {
            setLoading(false);
            console.log("Error Fetching Products", error);
            handleClick("Error Fetching Products", "error");
        }
    }
    const deleteProduct = async (pId) => {
        setLoading(true);
        try {
            const response = await axios.delete(`${baseUrl}/product/${pId}`)
            setLoading(false);
            console.log("Deleting Product: ", response.data);
            response.data.message === "Product Deleted Successfully" ? handleClick(response.data.message, "success") : handleClick(response.data.message, "error")
            setLoadProduct(!loadProduct)
        } catch (error) {
            setLoading(false);
            console.log("Error Deleting Product", error);
            handleClick("Error Deleting Product", "error");
        }
    }

    return (
        <>
            {(loading) ?
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                </Box>
                :
                <div className='allProducts'>
                    {
                        allProducts.map((product) => (
                            <>
                                <div className="card">
                                    <div className="cardImage">
                                        <img src="https://source.unsplash.com/345x140/?products" alt="Product" />
                                    </div>
                                    <div className="cardName">{product.name}</div>
                                    <div className="cardPrice">$ {product.price}</div>
                                    <div className="cardDescription">{product.description}</div>
                                    <div className="cardButton">
                                        <Button onClick={() => { deleteProduct(product.id) }} variant="contained" color="error" startIcon={<DeleteIcon />}>
                                            Delete
                                        </Button>
                                        <Button onClick={() => { handleClickModal(product) }} variant="contained" startIcon={<EditIcon />}>
                                            Edit
                                        </Button>
                                    </div>
                                </div>
                                <Dialog fullWidth="lg" maxWidth="lg" open={openModal} onClose={handleCloseModal}>
                                    <DialogTitle>Edit Product</DialogTitle>
                                    <DialogContent>
                                        <form className='addProduct' onSubmit={formik.handleSubmit}>
                                            <TextField
                                                error={(formik.touched.name && formik.errors.name) ? true : false}
                                                name='name'
                                                id="filled-error-helper-text"
                                                label="Product Name"
                                                helperText={formik.touched.name && formik.errors.name}
                                                variant="filled"
                                                value={formik.values.name}
                                                onChange={formik.handleChange}
                                            />

                                            <TextField
                                                error={(formik.touched.price && formik.errors.price) ? true : false}
                                                name='price'
                                                type='number'
                                                id="filled-error-helper-text"
                                                label="Product Price in Dollars"
                                                helperText={formik.touched.price && formik.errors.price}
                                                variant="filled"
                                                value={formik.values.price}
                                                onChange={formik.handleChange}
                                            />

                                            <TextField
                                                error={(formik.touched.description && formik.errors.description) ? true : false}
                                                name='description'
                                                id="filled-error-helper-text"
                                                label="Product Description"
                                                helperText={formik.touched.description && formik.errors.description}
                                                variant="filled"
                                                multiline
                                                rows={4}
                                                value={formik.values.description}
                                                onChange={formik.handleChange}
                                            />
                                            <div>
                                                <Button variant="contained" type='submit'>Edit Product</Button>
                                            </div>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </>
                        ))
                    }
                </div>
            }
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                    {alertMessage}
                </Alert>
            </Snackbar>


        </>
    )
}

export default ViewProducts