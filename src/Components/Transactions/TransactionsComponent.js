import { useState, useEffect } from "react";
import { Table, Modal, Button } from "antd";
import { Link } from "react-router-dom";

let TransactionsComponent = () => {
    let [transactions, setTransactions] = useState([]);
    let [selectedTransaction, setSelectedTransaction] = useState(null);
    let [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        getTransactions();
    }, []);

    let getTransactions = async () => {
        let response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL + "/transactions/own", {
            method: "GET",
            headers: {
                "apikey": localStorage.getItem("apiKey")
            },
        });

        if (response.ok) {
            let jsonData = await response.json();
            setTransactions(jsonData);
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach(e => console.log("Error: " + e.msg));
        }
    };

    const showDetails = (record) => {
        setSelectedTransaction(record);
        setIsModalVisible(true);
    };

    const handleClose = () => {
        setIsModalVisible(false);
        setSelectedTransaction(null);
    };

    const columns = [
        {
            title: "Product",
            dataIndex: "title",
            key: "title"
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price"
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            render: (text) => new Date(text).toLocaleDateString()
        },
        {
            title: "Seller",
            dataIndex: [],
            render: (product) =>
                product.sellerId ? <Link to={"/profile/"+product.sellerId}>I am the seller</Link> : "N/A"
        },
        {
            title: "Buyer",
            dataIndex: [],
            render: (product) =>
                product.buyerId ? <Link to={"/profile/"+product.buyerId}>I am the buyer</Link> : "N/A"
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => <Button onClick={() => showDetails(record)}>More details</Button>
        }
    ];

    return (
        <div>
            <h2>My Transactions</h2>
            <Table dataSource={transactions} columns={columns} rowKey="id" />
            {selectedTransaction && (
                <Modal title="Detalles de la Transacción" visible={isModalVisible} onCancel={handleClose} footer={null}>
                    <p><strong>Product:</strong> {selectedTransaction.title}</p>
                    <p><strong>Category:</strong> {selectedTransaction.category}</p>
                    <p><strong>Description:</strong> {selectedTransaction.description}</p>
                    <p><strong>Seller:</strong> <Link to={`/profile/${selectedTransaction.sellerId}`}>{selectedTransaction.sellerId}</Link></p>
                    <p><strong>Buyer Address:</strong> {selectedTransaction.buyerAddress}</p>
                    <p><strong>Buyer Country:</strong> {selectedTransaction.buyerCountry}</p>
                    <p><strong>Buyer Postal Code:</strong> {selectedTransaction.buyerPostCode}</p>
                    <p><strong>Buyer:</strong> <Link to={`/profile/${selectedTransaction.buyerId}`}>{selectedTransaction.buyerId}</Link></p>
                    <p><strong>Price:</strong> ${selectedTransaction.price}</p>
                    <p><strong>Date:</strong> {new Date(selectedTransaction.date).toLocaleDateString()}</p>
                </Modal>
            )}
        </div>
    );
};

export default TransactionsComponent;
