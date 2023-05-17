import {useRef, useState} from "react";
import {IoMdAddCircle} from "react-icons/io";
import {Button, Form, ModalTitle} from "react-bootstrap";
import axios from "axios";
import {toast} from "react-toastify";
import Modal from "react-bootstrap/Modal";

function AddProduct({cx, styles, newProduct, setNewProduct, setProducts}) {
    const [show, setShow] = useState(false);

    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false);

    }

    const productNameRef = useRef(null)

    const handleAddProduct = () => {
        axios
            .post("http://localhost:5000/product", newProduct)
            .then((response) => {
                setProducts((prevState) => [...prevState, response.data]);
                setNewProduct({});
                setShow(false);
                toast.success('Product added successfully!', {
                    position: "bottom-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
            })
            .catch((error) => {
                console.log(error);
                toast.error('Error adding product!');
            });

        productNameRef.current.focus();
    };

    function handleInputChange(e) {
        const {name, value} = e.target;
        if (name === 'quantity' && !validateInput(value)) {
            return; // Do not update state if input is invalid
        }
        setNewProduct(prevState => ({...prevState, [name]: value}));
    }

    function validateInput(value) {
        const regex = /^[1-9]\d*$/; // Only allow positive integers not starting with 0
        return regex.test(value);
    }

    return (
        <>
            <Button
                onClick={handleShow}
            >
                <IoMdAddCircle/>
            </Button>

            <Modal
                show={show}
                onHide={handleClose}
            >
                <Modal.Header closeButton>
                    <ModalTitle>Add Product</ModalTitle>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Control
                            ref={productNameRef}
                            type="text"
                            value={newProduct.name || ""}
                            onChange={handleInputChange}
                        />
                        <Form.Control
                            name="quantity"
                            type="number"
                            value={newProduct.quantity || ''}
                            onChange={handleInputChange}
                        />
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleClose}>
                        Close
                    </Button>
                    <Button onClick={handleAddProduct}>
                        Add Product
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default AddProduct;