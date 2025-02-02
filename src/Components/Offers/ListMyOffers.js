import { useEffect, useState } from "react";
import { Table, Button, message, Space } from "antd";

const ListMyOffers = (props) => {
    let { openNotification } = props;
    const [offers, setOffers] = useState([]);

    useEffect(() => {
        fetch("http://51.178.26.204:5050/offers/received", {
            headers: { "apikey": localStorage.getItem("apiKey") }
        })
            .then(res => res.json())
            .then(data => setOffers(data));
    }, []);

    const acceptOffer = async (id) => {
        await fetch(`http://51.178.26.204:5050/offers/${id}/accept`, {
            method: "POST",
            headers: { "apikey": localStorage.getItem("apiKey") }
        });
        openNotification("top", "Offer accepted", "success");
        setOffers(offers.filter(o => o.id !== id));
    };

    const rejectOffer = async (id) => {
        await fetch(`http://51.178.26.204:5050/offers/${id}`, {
            method: "DELETE",
            headers: { "apikey": localStorage.getItem("apiKey") }
        });
        openNotification("top", "Offer rejected", "error");
        setOffers(offers.filter(o => o.id !== id));
    };

    return (
        <Table
            dataSource={offers}
            columns={[
                { title: "Product", dataIndex: "productId" },
                { title: "Price", dataIndex: "price" },
                {
                    title: "Actions",
                    render: (_, record) => (
                        <Space>
                            <Button type="primary" onClick={() => acceptOffer(record.id)}>Accept</Button>
                            <Button type="default" danger onClick={() => rejectOffer(record.id)}>Reject</Button>
                        </Space>
                    )
                }
            ]}
        />
    );
};

export default ListMyOffers;
