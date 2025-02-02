import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Col, Row, Input, Select, Button } from "antd";

const { Option } = Select;

const categories = ["Electrónica", "Moda", "Hogar", "Deportes", "Libros", "Juguetes", "Salud"];
const MAX_PRODUCTS = 12;

let ListProductsComponent = (props) => {
    let [products, setProducts] = useState([]);
    let [filteredProducts, setFilteredProducts] = useState([]);
    let [visibleProducts, setVisibleProducts] = useState(MAX_PRODUCTS);
    let [filters, setFilters] = useState({ category: "", title: "", minPrice: "", maxPrice: "" });
    let [sortOrder, setSortOrder] = useState("recent");

    useEffect(() => {
        getProducts();
    }, []);

    let getProducts = async () => {
        let response = await fetch("http://51.178.26.204:5050/products", {
            method: "GET",
            headers: {
                "apikey": localStorage.getItem("apiKey"),
            },
        });

        if (response.ok) {
            let jsonData = await response.json();
            let promisesForImages = jsonData.map(async (p) => {
                let urlImage = "http://51.178.26.204:5050/images/" + p.id + ".png";
                let existsImage = await checkURL(urlImage);
                p.image = existsImage ? urlImage : "/imageMockup.png";
                return p;
            });

            let productsWithImage = await Promise.all(promisesForImages);
            let availableProducts = productsWithImage.filter((p) => !p.buyerId);
            setProducts(availableProducts);
            setFilteredProducts(availableProducts);
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach((e) => console.log("Error: " + e.msg));
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

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const handleSortChange = (value) => {
        setSortOrder(value);
    };

    useEffect(() => {
        let filtered = products.filter((product) => {
            return (
                (!filters.category || product.category === filters.category) &&
                (!filters.title || product.title.toLowerCase().includes(filters.title.toLowerCase())) &&
                (!filters.minPrice || product.price >= parseFloat(filters.minPrice)) &&
                (!filters.maxPrice || product.price <= parseFloat(filters.maxPrice))
            );
        });

        if (sortOrder === "price") {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortOrder === "price-desc") {
            filtered.sort((a, b) => b.price - a.price);
        } else if (sortOrder === "recent") {
            filtered.sort((a, b) => (b.date ? Number(b.date) : 0) - (a.date ? Number(a.date) : 0));
        } else if (sortOrder === "oldest") {
            filtered.sort((a, b) => (a.date ? Number(a.date) : 0) - (b.date ? Number(b.date) : 0));
        }

        setFilteredProducts(filtered);
    }, [filters, products, sortOrder]);

    const userId = localStorage.getItem("userId");

    return (
        <div>
            <h2>Products</h2>
            <Row gutter={[16, 16]}>
                <Col span={6}>
                    <Select placeholder="Category" style={{ width: "100%" }} onChange={(value) => handleFilterChange("category", value)}>
                        <Option value="">All</Option>
                        {categories.map((category) => (
                            <Option key={category} value={category}>
                                {category}
                            </Option>
                        ))}
                    </Select>
                </Col>
                <Col span={6}>
                    <Input placeholder="Title" onChange={(e) => handleFilterChange("title", e.target.value)} />
                </Col>
                <Col span={6}>
                    <Input type="number" placeholder="Min price" onChange={(e) => handleFilterChange("minPrice", e.target.value)} />
                </Col>
                <Col span={6}>
                    <Input type="number" placeholder="Max price" onChange={(e) => handleFilterChange("maxPrice", e.target.value)} />
                </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
                <Col span={6}>
                    <Select placeholder="Sort by" style={{ width: "100%" }} onChange={handleSortChange}>
                        <Option value="recent">Newest</Option>
                        <Option value="oldest">Oldest</Option>
                        <Option value="price">Price (low to high)</Option>
                        <Option value="price-desc">Price (high to low)</Option>
                    </Select>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
                {filteredProducts.slice(0, visibleProducts).map((p) => (
                    <Col span={8} key={p.id}>
                        <div style={{ position: "relative" }}>
                            {p.sellerId == userId && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "10px",
                                        left: "-10px",
                                        backgroundColor: "rgba(255, 0, 0, 0.7)",
                                        color: "white",
                                        padding: "5px 20px",
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                        transform: "rotate(-30deg)",
                                        zIndex: 2,
                                    }}
                                >
                                    My Product
                                </div>
                            )}
                            <Link to={"/products/" + p.id}>
                                <Card title={p.title} cover={<img src={p.image} alt={p.title} />}>
                                    {p.price} €
                                </Card>
                            </Link>
                        </div>
                    </Col>
                ))}
            </Row>

            {filteredProducts.length > visibleProducts && (
                <Row justify="center" style={{ marginTop: "20px" }}>
                    <Button type="primary" onClick={() => setVisibleProducts(visibleProducts + MAX_PRODUCTS)}>
                        Load More
                    </Button>
                </Row>
            )}
        </div>
    );
};

export default ListProductsComponent;
