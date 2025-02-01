import {useState, useEffect} from "react";
import {useParams, useNavigate, Link} from 'react-router-dom';
import {Typography, Card, Descriptions, Image, Button} from 'antd';
import {ShoppingOutlined} from '@ant-design/icons';
import CreateOfferComponent from "../Offers/CreateOfferComponent";

let DetailsProductComponent = (props) => {
    let {openNotification} = props
    let navigate = useNavigate();
    const {id} = useParams();

    let [product, setProduct] = useState({})
    let [userId, setUserId] = useState(null);

    useEffect(() => {
        getProduct(id);
        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) {
            setUserId(parseInt(storedUserId));
        }
    }, [])

    let buyProduct = async () => {
        let response = await fetch(
            process.env.REACT_APP_BACKEND_BASE_URL + "/transactions/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json ",
                    "apikey": localStorage.getItem("apiKey")
                },
                body: JSON.stringify({
                    productId: id
                })
            });

        if (response.ok) {
            let jsonData = await response.json();
            if (jsonData.affectedRows == 1) {

            }
            openNotification("top", "Purchase made successfully", "success")
            navigate("/products")
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach(e => {
                console.log("Error: " + e.msg)
            })
        }
    }

    let getProduct = async (id) => {
        let response = await fetch(
            process.env.REACT_APP_BACKEND_BASE_URL + "/products/" + id,
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
            });

        if (response.ok) {
            let jsonData = await response.json();
            setProduct(jsonData)
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach(e => {
                console.log("Error: " + e.msg)
            })
        }
    }

    let clickReturn = () => {
        navigate("/products")
    }

    const {Text} = Typography;
    let labelProductPrice = "No-Oferta"
    if (product.price < 10000) {
        labelProductPrice = "Oferta"
    }
    return (
        <Card>
            <Image src="/item1.png"/>
            <Descriptions title={product.title}>
                <Descriptions.Item label="Id">
                    {product.id}
                </Descriptions.Item>
                <Descriptions.Item label="Description">
                    {product.description}
                </Descriptions.Item>
                <Descriptions.Item label="Seller">
                    <Link to={`/profile/${product.sellerId}`}>Show Seller profile</Link>
                </Descriptions.Item>
                <Descriptions.Item>
                    <Text strong underline style={{fontSize: 20}}>{product.price}</Text>
                    {labelProductPrice}
                </Descriptions.Item>
                <Descriptions.Item>
                    {product?.sellerId && userId && userId !== product.sellerId && (
                        <CreateOfferComponent productId={product.id} />
                    )}
                </Descriptions.Item>
                <Descriptions.Item>
                    <Button type="primary" onClick={buyProduct}
                            icon={<ShoppingOutlined/>} size="large">
                        Buy
                    </Button>
                </Descriptions.Item>
            </Descriptions>
        </Card>
    )
}

export default DetailsProductComponent;
