import {useState, useEffect } from "react";
import { Link } from "react-router-dom"
import { Card, Col, Row, Input, Select } from 'antd';

const { Option } = Select;

const categories = ["Electrónica", "Moda", "Hogar", "Deportes", "Libros", "Juguetes", "Salud"];

let ListProductsComponent = () => {
    let [products, setProducts] = useState([]);
    let [filteredProducts, setFilteredProducts] = useState([]);
    let [filters, setFilters] = useState({ category: "", title: "", minPrice: "", maxPrice: "" });

    useEffect(() => {
        getProducts();
    }, [])

    let getProducts = async () => {
        let response = await fetch(process.env.REACT_APP_BACKEND_BASE_URL+"/products",
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
            });

        if ( response.ok ){
            let jsonData = await response.json();

            let promisesForImages = jsonData.map( async p =>  {
                let urlImage = process.env.REACT_APP_BACKEND_BASE_URL+"/images/"+p.id+".png"
                let existsImage = await checkURL(urlImage);
                p.image = existsImage ? urlImage : "/imageMockup.png";
                return p;
            })

            let productsWithImage = await Promise.all(promisesForImages);
            let availableProducts = productsWithImage.filter(p => !p.buyerEmail);
            setProducts(availableProducts);
            setFilteredProducts(availableProducts);
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach(e => console.log("Error: "+e.msg));
        }
    }

    let checkURL = async (url) => {
        try {
            let response = await fetch(url);
            return response.ok;
        } catch (error) {
            return false;
        }
    }

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    useEffect(() => {
        let filtered = products.filter(product => {
            return (
                (!filters.category || product.category === filters.category) &&
                (!filters.title || product.title.toLowerCase().includes(filters.title.toLowerCase())) &&
                (!filters.minPrice || product.price >= parseFloat(filters.minPrice)) &&
                (!filters.maxPrice || product.price <= parseFloat(filters.maxPrice))
            );
        });
        setFilteredProducts(filtered);
    }, [filters, products]);

    return (
        <div>
            <h2>Products</h2>
            <Row gutter={[16, 16]}>
                <Col span={6}>
                    <Select placeholder="Categoría" style={{ width: "100%" }} onChange={value => handleFilterChange("category", value)}>
                        <Option value="">Todas</Option>
                        {categories.map(category => (
                            <Option key={category} value={category}>{category}</Option>
                        ))}
                    </Select>
                </Col>
                <Col span={6}>
                    <Input placeholder="Título" onChange={e => handleFilterChange("title", e.target.value)} />
                </Col>
                <Col span={6}>
                    <Input type="number" placeholder="Precio mínimo" onChange={e => handleFilterChange("minPrice", e.target.value)} />
                </Col>
                <Col span={6}>
                    <Input type="number" placeholder="Precio máximo" onChange={e => handleFilterChange("maxPrice", e.target.value)} />
                </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
                {filteredProducts.map(p => (
                    <Col span={8} key={p.id}>
                        <Link to={"/products/"+p.id}>
                            <Card title={p.title} cover={<img src={p.image} alt={p.title} />}>
                                {p.price}
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>
        </div>
    )
}

export default ListProductsComponent;
