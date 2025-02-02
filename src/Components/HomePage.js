import React, { useEffect, useState } from "react";
import { Card, Row, Col, Typography } from "antd";

const categories = [
    { name: "Electrónica", description: "Encuentra los últimos gadgets y dispositivos electrónicos." },
    { name: "Moda", description: "Ropa, accesorios y lo último en tendencias." },
    { name: "Hogar", description: "Todo lo que necesitas para tu casa y decoración." },
    { name: "Deportes", description: "Equipamiento y ropa para tus actividades deportivas." },
    { name: "Libros", description: "Explora una gran variedad de libros y literatura." },
    { name: "Juguetes", description: "Juguetes para todas las edades y preferencias." },
    { name: "Salud", description: "Productos para el bienestar y cuidado personal." }
];

const HomePage = () => {
    const [productCounts, setProductCounts] = useState({});

    useEffect(() => {
        fetch("http://51.178.26.204:5050/products/categories/count")
            .then(response => response.json())
            .then(data => {
                const transformedData = {};
                data.forEach(item => {
                    if (item.category) {
                        transformedData[item.category] = item.num_products;
                    }
                });
                setProductCounts(transformedData);
            })
            .catch(error => console.error("Error fetching product counts:", error));
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <Typography.Title level={2}>Bienvenido a nuestra plataforma de compraventa</Typography.Title>
            <Typography.Paragraph>
                Explora las categorías y descubre productos disponibles en nuestra comunidad.
            </Typography.Paragraph>
                <Row gutter={[16, 16]}>
                    {categories.map(category => (
                        <Col xs={24} sm={12} md={8} key={category.name}>
                            <Card title={category.name} bordered>
                                <Typography.Paragraph>{category.description}</Typography.Paragraph>
                                <Typography.Text>
                                    Productos disponibles en la categoría: {productCounts[category.name] || 0}
                                </Typography.Text>
                            </Card>
                        </Col>
                    ))}
                </Row>
        </div>
    );
};

export default HomePage;
