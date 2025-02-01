import { useState } from "react";
import { Input, Button, Card, Form, Select, DatePicker } from "antd";
import { validateFormDataInputRequired, validateFormDataInputEmail, allowSubmitForm, setServerErrors } from "../../Utils/UtilsValidations";
import { dateToTimestamp } from "../../Utils/UtilsDates";

const { Option } = Select;

const CreateUserComponent = ({ openNotification }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({});

    const handleInputChange = (key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const clickCreate = async () => {
        if (!allowSubmitForm(formData, {}, ["email", "password", "name", "surname", "documentIdentity", "documentNumber", "country", "address", "postalCode", "birthday"])) {
            openNotification("top", "Form contains errors", "error");
            return;
        }

        const formattedData = {
            ...formData,
            birthday: dateToTimestamp(formData.birthday)
        };

        setLoading(true);
        let response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL + "/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formattedData),
        });

        if (response.ok) {
            openNotification("top", "User successfully created", "success");
            form.resetFields();
        } else {
            let responseBody = await response.json();
            setServerErrors(responseBody.errors, () => {});
            openNotification("top", "Error creating user", "error");
        }
        setLoading(false);
    };

    return (
        <Card title="Create Account" style={{ maxWidth: 400, margin: "auto", marginTop: 20 }}>
            <Form form={form} layout="vertical" onFinish={clickCreate}>
                <Form.Item label="Email" name="email" rules={[{ required: true, type: "email", message: "Invalid email format" }]}>
                    <Input autoFocus placeholder="Email" onChange={(e) => handleInputChange("email", e.target.value)} />
                </Form.Item>
                <Form.Item label="Password" name="password" rules={[{ required: true, message: "Password is required" }]}>
                    <Input.Password placeholder="Password" onChange={(e) => handleInputChange("password", e.target.value)} />
                </Form.Item>
                <Form.Item label="First Name" name="name" rules={[{ required: true, message: "First name is required" }]}>
                    <Input placeholder="First Name" onChange={(e) => handleInputChange("name", e.target.value)} />
                </Form.Item>
                <Form.Item label="Last Name" name="surname" rules={[{ required: true, message: "Last name is required" }]}>
                    <Input placeholder="Last Name" onChange={(e) => handleInputChange("surname", e.target.value)} />
                </Form.Item>
                <Form.Item label="Document Type" name="documentIdentity" rules={[{ required: true, message: "Document type is required" }]}>
                    <Select placeholder="Select" onChange={(value) => handleInputChange("documentIdentity", value)}>
                        <Option value="DNI">DNI</Option>
                        <Option value="Passport">Passport</Option>
                        <Option value="Other">Other</Option>
                    </Select>
                </Form.Item>
                <Form.Item label="Document Number" name="documentNumber" rules={[{ required: true, message: "Document number is required" }]}>
                    <Input placeholder="Document Number" onChange={(e) => handleInputChange("documentNumber", e.target.value)} />
                </Form.Item>
                <Form.Item label="Country" name="country" rules={[{ required: true, message: "Country is required" }]}>
                    <Input placeholder="Country" onChange={(e) => handleInputChange("country", e.target.value)} />
                </Form.Item>
                <Form.Item label="Address" name="address" rules={[{ required: true, message: "Address is required" }]}>
                    <Input placeholder="Address" onChange={(e) => handleInputChange("address", e.target.value)} />
                </Form.Item>
                <Form.Item label="Postal Code" name="postalCode" rules={[{ required: true, message: "Postal code is required" }]}>
                    <Input placeholder="Postal Code" onChange={(e) => handleInputChange("postalCode", e.target.value)} />
                </Form.Item>
                <Form.Item label="Birthday" name="birthday" rules={[{ required: true, message: "Birthday is required" }]}>
                    <DatePicker style={{ width: "100%" }} onChange={(date) => handleInputChange("birthday", date)} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        Create Account
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default CreateUserComponent;
