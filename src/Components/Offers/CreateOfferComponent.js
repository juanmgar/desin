import { useState } from "react";
import { Button, Input, message } from "antd";

const CreateOfferComponent = ({ productId }) => {
    const [price, setPrice] = useState("");

    const sendOffer = async () => {
        let response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL + "/offers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "apikey": localStorage.getItem("apiKey"),
            },
            body: JSON.stringify({ productId, price }),
        });

        if (response.ok) {
            message.success("Offer sent successfully!");
        } else {
            message.error("Failed to send offer");
        }
    };

    return (
        <div>
            <Input type="number" placeholder="Offer Price (€)" onChange={(e) => setPrice(e.target.value)} />
            <Button type="primary" onClick={sendOffer}>Send Offer</Button>
        </div>
    );
};

export default CreateOfferComponent;
