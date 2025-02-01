import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, Table } from "antd";

const UserProfileComponent = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchUserData();
        fetchUserTransactions();
        fetchUserProducts();
    }, [id]);

    const fetchUserData = async () => {
        let response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/users/${id}`, {
            method: "GET",
            headers: { "apikey": localStorage.getItem("apiKey") },
        });
        if (response.ok) {
            setUser(await response.json());
        }
    };

    const fetchUserTransactions = async () => {
        let response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/transactions/public?sellerId=${id}`, {
            method: "GET",
            headers: { "apikey": localStorage.getItem("apiKey") },
        });
        if (response.ok) {
            setTransactions(await response.json());
        }
    };

    const fetchUserProducts = async () => {
        let response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/products?sellerId=${id}`, {
            method: "GET",
            headers: { "apikey": localStorage.getItem("apiKey") },
        });
        if (response.ok) {
            setProducts(await response.json());
        }
    };

    const transactionColumns = [
        { title: "Product", dataIndex: "title", key: "title" },
        { title: "Price", dataIndex: "price", key: "price" },
        { title: "Date", dataIndex: "date", key: "date", render: (text) => new Date(text).toLocaleDateString() },
        { title: "Seller", dataIndex: "sellerId", key: "sellerId", render: (id) => <Link to={`/profile/${id}`}>Show profile</Link> },
    ];

    const productColumns = [
        { title: "Product", dataIndex: "title", key: "title" },
        { title: "Price", dataIndex: "price", key: "price" },
        { title: "Seller", dataIndex: "sellerId", key: "sellerId", render: (id) => <Link to={`/profile/${id}`}>Show profile</Link> },
    ];

    return (
        <div>
            {user && (
                <Card title={`Profile ${user.name}`}>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Location:</strong> {user.location}</p>
                </Card>
            )}
            <h3>Transactions done</h3>
            <Table dataSource={transactions} columns={transactionColumns} rowKey="id" />
            <h3>Products in Sell</h3>
            <Table dataSource={products} columns={productColumns} rowKey="id" />
        </div>
    );
};

export default UserProfileComponent;
