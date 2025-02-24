import {useState, useEffect } from "react";
import { Table, Space } from 'antd';
import { Link } from "react-router-dom";
import { timestampToString} from "../../Utils/UtilsDates";

let ListMyProductsComponent = () => {
    let [products, setProducts] = useState([])

    useEffect(() => {
        getMyProducts();
    }, [])

    let deleteProduct = async (id) => {
        let response = await fetch(
            "http://51.178.26.204:5050/products/"+id,
            {
                method: "DELETE",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
            });

        if ( response.ok ){
            let jsonData = await response.json();
            if ( jsonData.deleted){
                let productsAftherDelete = products.filter(p => p.id != id)
                setProducts(productsAftherDelete)
            }
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach( e => {
                console.log("Error: "+e.msg)
            })
        }
    }

    let getMyProducts = async () => {
        let response = await fetch(
            "http://51.178.26.204:5050/products/own/",
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
            });

        if ( response.ok ){
            let jsonData = await response.json();
            jsonData.map( product => {
                product.key = product.id
                return product
            })
            setProducts(jsonData)
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            serverErrors.forEach( e => {
                console.log("Error: "+e.msg)
            })
        }
    }

    let columns = [
        {
            title: "Id",
            dataIndex: "id",
        },
        {
            title: "Title",
            dataIndex: "title"
        },
        {
            title: "Description",
            dataIndex: "description",
        },
        {
            title: "Price (€)",
            dataIndex: "price",
        },
        {
            title: "Date",
            dataIndex: "date",
            render: (date) => timestampToString(date)
        },
        {
            title: "Buyer",
            dataIndex: [],
            render: (product) =>
                product.buyerId ? <Link to={"/profile/"+product.buyerId}>{ product.buyerEmail }</Link> : "Not Sold"
        },
        {
            title: "Actions",
            dataIndex: "id",
            render: (id) =>
                <Space.Compact direction="vertical">
                    <Link to={"/products/edit/"+id}>Edit</Link>
                    <Link to={"#"} onClick={() => deleteProduct(id)}>Delete</Link>
                </Space.Compact>
        },
    ]

    return (
        <div>
        <h2>My Products</h2>
        <Table columns={columns} dataSource={products}></Table>
        </div>
    )
}

export default ListMyProductsComponent;