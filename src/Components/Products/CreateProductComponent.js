import {useState} from "react";
import {modifyStateProperty} from "../../Utils/UtilsState";
import {Card, Input, Button, Row, Col, Form, Upload, Select} from "antd";
import { useSelector, useDispatch } from "react-redux";
import { actions } from "../../Reducers/reducerCountSlice";
import {useNavigate} from "react-router-dom";

let CreateProductComponent = (props) => {
    let {openNotification} = props
    const countGlobalState1 = useSelector(state => state.reducerCount);
    const countGlobalState2 = useSelector(state => state.reducerCountSlice);
    const dispatch = useDispatch();
    let navigate = useNavigate();

    const categories = ["Electrónica", "Moda", "Hogar", "Deportes", "Libros", "Juguetes", "Salud"];

    let [formData, setFormData] = useState({})

    let clickCreateProduct = async () => {
        let response = await fetch(
            process.env.REACT_APP_BACKEND_BASE_URL + "/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json ",
                    "apikey": localStorage.getItem("apiKey"),
                    "userId": localStorage.getItem("userId")
                },
                body: JSON.stringify(formData)
            })

        if (response.ok) {
            let data = await response.json()
            await uploadImage(data.productId)
            openNotification("top", "Product creation successfull", "success")
            navigate("/products")
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach(e => {
                console.log("Error: " + e.msg)
            })
        }
    }

    let uploadImage = async (productId) => {
        let formDataPhotos = new FormData();
        formDataPhotos.append('image', formData.image);
        formDataPhotos.append('productId', productId);

        let response = await fetch(
            process.env.REACT_APP_BACKEND_BASE_URL + "/products/"+productId+"/image", {
                method: "POST",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
                body: formDataPhotos
            })
        if (response.ok) {

        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach(e => {
                console.log("Error: " + e.msg)
            })
        }
    }

    return (
        <Row align="middle" justify="center" style={{minHeight: "70vh"}}>
            <Col>
                <Card title="Create product" style={{width: "500px"}}>
                    <Form.Item label="">
                        <Input onChange={(i) => modifyStateProperty(formData, setFormData, "title", i.currentTarget.value)} size="large" type="text" placeholder="product title"></Input>
                    </Form.Item>

                    <Form.Item label="">
                        <Input onChange={(i) => modifyStateProperty(formData, setFormData, "description", i.currentTarget.value)} size="large" type="text" placeholder="description"></Input>
                    </Form.Item>

                    <Form.Item label="">
                        <Input onChange={(i) => modifyStateProperty(formData, setFormData, "price", i.currentTarget.value)} size="large" type="number" placeholder="price"></Input>
                    </Form.Item>

                    <Form.Item label="">
                        <Select placeholder="Select category" onChange={(value) => modifyStateProperty(formData, setFormData, "category", value)}>
                            {categories.map(category => (
                                <Select.Option key={category} value={category}>{category}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="image">
                        <Upload maxCount={1} action={(file) => modifyStateProperty(formData, setFormData, "image", file)} listType="picture-card">
                            Upload
                        </Upload>
                    </Form.Item>

                    <Button type="primary" block onClick={clickCreateProduct}>Sell Product</Button>
                </Card>
            </Col>
        </Row>
    )
}

export default CreateProductComponent;
