import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

let CreditCardsComponent = (props) => {
    let { openNotification } = props;
    let [creditCards, setCreditCards] = useState([]);
    let [isModalVisible, setIsModalVisible] = useState(false);
    let [form] = Form.useForm();

    useEffect(() => {
        getCreditCards();
    }, []);

    let getCreditCards = async () => {
        let response = await fetch("http://51.178.26.204:5050/creditCards", {
            method: "GET",
            headers: {
                "apikey": localStorage.getItem("apiKey"),
            },
        });

        if (response.ok) {
            let jsonData = await response.json();
            setCreditCards(jsonData);
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach((e) => console.log("Error: " + e.msg));
        }
    };

    let addCreditCard = async (values) => {
        let response = await fetch("http://51.178.26.204:5050/creditCards", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "apikey": localStorage.getItem("apiKey"),
            },
            body: JSON.stringify(values),
        });

        if (response.ok) {
            getCreditCards();
            setIsModalVisible(false);
            form.resetFields();
            openNotification("top", "Credit card added successfully", "success");
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach((e) => console.log("Error: " + e.msg));
        }
    };

    let deleteCreditCard = async (id) => {
        let response = await fetch(`http://51.178.26.204:5050/creditCards/${id}`, {
            method: "DELETE",
            headers: {
                "apikey": localStorage.getItem("apiKey"),
            },
        });

        if (response.ok) {
            getCreditCards();
            openNotification("top", "Credit card deleted successfully", "success");
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach((e) => console.log("Error: " + e.msg));
        }
    };

    const validateExpirationDate = (_, value) => {
        if (!/^(0[1-9]|1[0-2])\d{4}$/.test(value)) {
            return Promise.reject("Format must be MMAAAA (e.g., 032026 for March 2026)");
        }

        const month = parseInt(value.substring(0, 2), 10);
        const year = parseInt(value.substring(2, 6), 10);
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1; // getMonth() devuelve 0-11
        const currentYear = currentDate.getFullYear();

        if (year < currentYear || (year === currentYear && month < currentMonth)) {
            return Promise.reject("Expiration date must be in the future");
        }

        return Promise.resolve();
    };

    const columns = [
        {
            title: "Alias",
            dataIndex: "alias",
            key: "alias",
        },
        {
            title: "Card Number",
            dataIndex: "number",
            key: "number",
        },
        {
            title: "CVV",
            dataIndex: "code",
            key: "code",
        },
        {
            title: "Expiration",
            dataIndex: "expirationDate",
            key: "expirationDate",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => <Button onClick={() => deleteCreditCard(record.id)}>Delete</Button>,
        },
    ];

    return (
        <div>
            <h2>My Credit Cards</h2>
            <Button onClick={() => setIsModalVisible(true)} type="primary" style={{ marginBottom: "20px" }}>
                Add Card
            </Button>
            <Table dataSource={creditCards} columns={columns} rowKey="id" />
            <Modal title="Add Card" visible={isModalVisible} onCancel={() => setIsModalVisible(false)} onOk={() => form.submit()}>
                <Form form={form} layout="vertical" onFinish={addCreditCard}>
                    <Form.Item name="alias" label="Alias" rules={[{ required: true, message: "Introduce an alias" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="number" label="Card Number" rules={[{ required: true, message: "Introduce your credit number" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="code"
                        label={
                            <span>
                                CVV{" "}
                                <Tooltip title="The CVV is the 3-digit code on the back of your card (or 4 digits for AMEX).">
                                    <QuestionCircleOutlined style={{ color: "gray" }} />
                                </Tooltip>
                            </span>
                        }
                        rules={[{ required: true, message: "Introduce the CVV" }]}
                    >
                        <Input maxLength={4} />
                    </Form.Item>
                    <Form.Item
                        name="expirationDate"
                        label="Expiration Date (MMAAAA)"
                        rules={[{ required: true, validator: validateExpirationDate }]}
                    >
                        <Input placeholder="MMAAAA (e.g., 032026 for March 2026)" maxLength={6} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CreditCardsComponent;
