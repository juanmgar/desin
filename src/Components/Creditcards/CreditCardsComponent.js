import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input } from "antd";

let CreditCardsComponent = (props) => {
    let {openNotification} = props
    let [creditCards, setCreditCards] = useState([]);
    let [isModalVisible, setIsModalVisible] = useState(false);
    let [form] = Form.useForm();

    useEffect(() => {
        getCreditCards();
    }, []);

    let getCreditCards = async () => {
        let response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL + "/creditCards", {
            method: "GET",
            headers: {
                "apikey": localStorage.getItem("apiKey")
            },
        });

        if (response.ok) {
            let jsonData = await response.json();
            setCreditCards(jsonData);
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach(e => console.log("Error: " + e.msg));
        }
    };

    let addCreditCard = async (values) => {
        let response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL + "/creditCards", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "apikey": localStorage.getItem("apiKey")
            },
            body: JSON.stringify(values)
        });

        if (response.ok) {
            getCreditCards();
            setIsModalVisible(false);
            form.resetFields();
            openNotification("top", "Credit card added successfully", "success")
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach(e => console.log("Error: " + e.msg));
        }
    };

    let deleteCreditCard = async (id) => {
        let response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL + `/creditCards/${id}`, {
            method: "DELETE",
            headers: {
                "apikey": localStorage.getItem("apiKey")
            },
        });

        if (response.ok) {
            getCreditCards();
            openNotification("top", "Credit card deleted successfully", "success")
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach(e => console.log("Error: " + e.msg));
        }
    };

    const columns = [
        {
            title: "Alias",
            dataIndex: "alias",
            key: "alias"
        },
        {
            title: "Card Number",
            dataIndex: "number",
            key: "number"
        },
        {
            title: "Code",
            dataIndex: "code",
            key: "code"
        },
        {
            title: "Expiration",
            dataIndex: "expirationDate",
            key: "expirationDate"
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => <Button onClick={() => deleteCreditCard(record.id)}>Delete</Button>
        }
    ];

    return (
        <div>
            <h2>My Credit Cards</h2>
            <Button onClick={() => setIsModalVisible(true)} type="primary" style={{ marginBottom: "20px" }}>Add Card</Button>
            <Table dataSource={creditCards} columns={columns} rowKey="id" />
            <Modal title="Add Card" visible={isModalVisible} onCancel={() => setIsModalVisible(false)} onOk={() => form.submit()}>
                <Form form={form} layout="vertical" onFinish={addCreditCard}>
                    <Form.Item name="alias" label="Alias" rules={[{ required: true, message: "Introduce an alias" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="number" label="Card Number" rules={[{ required: true, message: "Introduce your credit number" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="code" label="Code" rules={[{ required: true, message: "Introduce the code" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="expirationDate" label="Experation date" rules={[{ required: true, message: "Introduce expiration date" }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CreditCardsComponent;
