import {useState, useEffect} from "react";
import {useParams, useNavigate, Link} from 'react-router-dom';
import {Typography, Card, Descriptions, Image, Button} from 'antd';
import {ShoppingOutlined} from '@ant-design/icons';
import CreateOfferComponent from "../Offers/CreateOfferComponent";

let DetailsProductComponent = (props) => {
    let {openNotification} = props
    let navigate = useNavigate();
    const {id} = useParams();

    let [product, setProduct] = useState({});
    let [userId, setUserId] = useState(null);
    let [imageSrc, setImageSrc] = useState("/imageMockup.png");

    useEffect(() => {
        getProduct(id);
        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) {
            setUserId(parseInt(storedUserId));
        }
    }, [id]);

    let buyProduct = async () => {
        let response = await fetch(
            "http://51.178.26.204:5050/transactions/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "apikey": localStorage.getItem("apiKey")
                },
                body: JSON.stringify({ productId: id })
            });

        if (response.ok) {
            openNotification("top", "Purchase made successfully", "success");
            navigate("/products");
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach(e => console.log("Error: " + e.msg));
        }
    };

    let getProduct = async (id) => {
        let response = await fetch(
            "http://51.178.26.204:5050/products/" + id,
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
            });

        if (response.ok) {
            let jsonData = await response.json();

            let urlImage = "http://51.178.26.204:5050/images/" + jsonData.id + ".png";

            let existsImage = await checkURL(urlImage);
            setImageSrc(existsImage ? urlImage : "/imageMockup.png");

            setProduct(jsonData);
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach(e => console.log("Error: " + e.msg));
        }
    };

    let checkURL = async (url) => {
        try {
            let response = await fetch(url);
            return response.ok;
        } catch (error) {
            return false;
        }
    };

    let clickReturn = () => {
        navigate("/products");
    };

    const {Text} = Typography;
    let labelProductPrice = product.price < 10000 ? "Oferta" : "No-Oferta";

    return (
        <Card>
            <Image src={imageSrc} alt={product.title} />
            <Descriptions title={product.title}>
                <Descriptions.Item label="Id">{product.id}</Descriptions.Item>
                <Descriptions.Item label="Description">{product.description}</Descriptions.Item>
                <Descriptions.Item label="Seller">
                    <Link to={`/profile/${product.sellerId}`}>Show Seller profile</Link>
                </Descriptions.Item>
                <Descriptions.Item>
                    <Text strong underline style={{fontSize: 20}}>{product.price}</Text> {labelProductPrice}
                </Descriptions.Item>
                <Descriptions.Item>
                    {product?.sellerId && userId && userId !== product.sellerId && (
                        <CreateOfferComponent productId={product.id} />
                    )}
                    {product?.sellerId && userId && userId == product.sellerId && (
                        <span style={{ color: "red", fontWeight: "bold" }}>
                            This product is yours. You cannot buy it.
                        </span>
                    )}
                </Descriptions.Item>
                <Descriptions.Item>
                    {product?.sellerId && userId && userId !== product.sellerId && (
                    <Button type="primary" onClick={buyProduct} icon={<ShoppingOutlined/>} size="large">
                        Buy
                    </Button>
                    )}
                </Descriptions.Item>
            </Descriptions>
        </Card>
    );
};

export default DetailsProductComponent;
