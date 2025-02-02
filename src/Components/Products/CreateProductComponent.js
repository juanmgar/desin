import { useState } from "react";
import { modifyStateProperty } from "../../Utils/UtilsState";
import { Card, Input, Button, Row, Col, Form, Upload, Select } from "antd";
import { useNavigate } from "react-router-dom";

let CreateProductComponent = (props) => {
    let { openNotification } = props;
    let navigate = useNavigate();

    const categories = ["Electronics", "Fashion", "Home", "Sports", "Books", "Toys", "Health"];

    let [formData, setFormData] = useState({});
    let [descriptionLength, setDescriptionLength] = useState(0);

    const MAX_TITLE_LENGTH = 50;
    const MAX_DESCRIPTION_LENGTH = 300;

    let clickCreateProduct = async () => {
        let response = await fetch("http://51.178.26.204:5050/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json ",
                "apikey": localStorage.getItem("apiKey"),
                "userId": localStorage.getItem("userId"),
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            let data = await response.json();
            await uploadImage(data.productId);
            openNotification("top", "Product creation successful", "success");
            navigate("/products");
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach(e => {
                console.log("Error: " + e.msg);
            });
        }
    };

    let uploadImage = async (productId) => {
        let formDataPhotos = new FormData();
        formDataPhotos.append("image", formData.image);
        formDataPhotos.append("productId", productId);

        let response = await fetch("http://51.178.26.204:5050/products/" + productId + "/image", {
            method: "POST",
            headers: {
                "apikey": localStorage.getItem("apiKey"),
            },
            body: formDataPhotos,
        });

        if (!response.ok) {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach(e => {
                console.log("Error: " + e.msg);
            });
        }
    };

    return (
        <Row align="middle" justify="center" style={{ minHeight: "70vh" }}>
            <Col>
                <Card title="Create product" style={{ width: "500px" }}>
                    <Form.Item label="Product Title">
                        <Input
                            maxLength={MAX_TITLE_LENGTH}
                            onChange={(i) =>
                                modifyStateProperty(formData, setFormData, "title", i.currentTarget.value.substring(0, MAX_TITLE_LENGTH))
                            }
                            size="large"
                            type="text"
                            placeholder={`Max ${MAX_TITLE_LENGTH} characters`}
                        />
                    </Form.Item>
                    <Form.Item label="Description">
                        <Input.TextArea
                            maxLength={MAX_DESCRIPTION_LENGTH}
                            onChange={(i) => {
                                let value = i.currentTarget.value.substring(0, MAX_DESCRIPTION_LENGTH);
                                modifyStateProperty(formData, setFormData, "description", value);
                                setDescriptionLength(value.length);
                            }}
                            size="large"
                            placeholder={`Max ${MAX_DESCRIPTION_LENGTH} characters`}
                            rows={4}
                        />
                        <span style={{ fontSize: "12px", color: "gray" }}>
                            {descriptionLength}/{MAX_DESCRIPTION_LENGTH} characters
                        </span>
                    </Form.Item>
                    <Form.Item label="Price">
                        <Input
                            onChange={(i) => modifyStateProperty(formData, setFormData, "price", i.currentTarget.value)}
                            size="large"
                            type="number"
                            placeholder="Enter price"
                        />
                    </Form.Item>
                    <Form.Item label="Category">
                        <Select
                            placeholder="Select category"
                            onChange={(value) => modifyStateProperty(formData, setFormData, "category", value)}
                        >
                            {categories.map(category => (
                                <Select.Option key={category} value={category}>
                                    {category}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="image">
                        <Upload
                            maxCount={1}
                            action={(file) => modifyStateProperty(formData, setFormData, "image", file)}
                            listType="picture-card"
                        >
                            Upload
                        </Upload>
                    </Form.Item>
                    <Button type="primary" block onClick={clickCreateProduct}>
                        Sell Product
                    </Button>
                </Card>
            </Col>
        </Row>
    );
};

export default CreateProductComponent;
