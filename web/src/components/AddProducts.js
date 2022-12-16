import React from 'react'
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

let baseUrl = '';
if (window.location.href.split(':')[0] === 'http') {
    baseUrl = 'http://localhost:5001';
}

const AddProducts = () => {
    const formik = useFormik({
        initialValues: {
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
            axios.post(`${baseUrl}/product`, {
                name: values.name,
                price: values.price,
                description: values.description,
            })
                .then(response => {
                    console.log("Adding Products: ", response.data);
                })
                .catch(err => {
                    console.log("Adding Products Error: ", err);
                })
        }
    })
    return (
        <form className='addProduct' onSubmit={formik.handleSubmit}>
            <h2>Add Product</h2>
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
                <Button variant="contained" type='submit'>Add Product</Button>
            </div>
        </form>
    )
}

export default AddProducts