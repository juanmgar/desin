import LoginFormComponent from "./Components/User/LoginFormComponent";
import CreateUserComponent from "./Components/User/CreateUserComponent";
import ListProductsComponent from "./Components/Products/ListProductsComponent";
import EditProductComponent from "./Components/Products/EditProductComponent";
import DetailsProductComponent from "./Components/Products/DetailsProductComponent";
import CreateProductComponent from "./Components/Products/CreateProductComponent";
import ListMyProductsComponent from "./Components/Products/ListMyProductsComponent";
import TransactionsComponent from "./Components/Transactions/TransactionsComponent";
import CreditCardsComponent from "./Components/Creditcards/CreditCardsComponent";
import UserProfileComponent from "./Components/User/UserProfileComponent";
import HomePage from "./Components/HomePage";
import {Route, Routes, Link, useNavigate, useLocation } from "react-router-dom";
import {Layout, Menu, Avatar, Typography, Col, Row, notification } from 'antd';
import {FireOutlined, LoginOutlined} from '@ant-design/icons';
import {useEffect, useState} from "react";
import ListMyOffers from "./Components/Offers/ListMyOffers";


const getTitleByPath = (path) => {
    switch (path) {
        case "/":
            return "Home - Wallapep";
        case "/login":
            return "Login - Wallapep";
        case "/register":
            return "Register - Wallapep";
        case "/products":
            return "Products - Wallapep";
        case "/products/own":
            return "My Products - Wallapep";
        case "/transactions":
            return "My Transactions - Wallapep";
        case "/creditcards":
            return "My Credit Cards - Wallapep";
        case "/offers":
            return "My Offers - Wallapep";
        case "/products/create":
            return "New Product - Wallapep";
        default:
            return "Wallapep";
    }
};

let App = () => {
    const [api, contextHolder] = notification.useNotification();

    let navigate = useNavigate();
    let location = useLocation();
    let [login, setLogin] = useState(false);

    let {Header, Content, Footer} = Layout;

    useEffect(() => {
        document.title = getTitleByPath(location.pathname);
        checkAll()
    }, [location.pathname])

    let checkAll = async () => {
        let isActive = await checkLoginIsActive()
        checkUserAccess(isActive)
    }

    const openNotification = (placement, text, type) => {
        api[type]({
            message: 'Notification',
            description: text,
            placement,
        });
    };

    let checkLoginIsActive = async () => {
        if (localStorage.getItem("apiKey") == null) {
            setLogin(false);
            return;
        }

        let response = await fetch(
            "http://51.178.26.204:5050/users/isActiveApiKey",
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                }
            });

        if (response.ok) {
            let jsonData = await response.json();
            setLogin(jsonData.activeApiKey)

            if (!jsonData.activeApiKey){
                navigate("/login")
            }
            return(jsonData.activeApiKey)
        } else {
            setLogin(false)
            navigate("/login")
            return (false)
        }
    }

    let checkUserAccess= async (isActive) => {
        let href = location.pathname
        if (!isActive && !["/","/login","/register"].includes(href) ){
            navigate("/login")
        }
    }

    let disconnect = async () => {
        let response = await fetch(
            "http://51.178.26.204:5050/users/disconnect",
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                }
            });

        localStorage.removeItem("apiKey");
        localStorage.removeItem("email");
        localStorage.removeItem("userId");
        setLogin(false);
        navigate("/login");
    };



    const {Text} = Typography;
    return (
        <Layout className="layout" style={{minHeight: "100vh"}}>
            {contextHolder}
            <Header>
                <Row>
                    <Col xs= {18} sm={19} md={20} lg={21} xl = {22}>
                        {!login &&
                            <Menu theme="dark" mode="horizontal" items={[
                                {key: "logo", label: <Link to="/"><img src="/logo.png" width="40" height="40" alt="Home"/></Link>},
                                {key: "menuLogin", icon: <LoginOutlined/>, label: <Link to="/login">Login</Link>},
                                {key: "menuRegister", label: <Link to="/register">Register</Link>},
                            ]}>
                            </Menu>

                        }

                        {login &&
                            <Menu theme="dark" mode="horizontal" items={[
                                {key: "logo", label: <Link to="/"><img src="/logo.png" width="40" height="40" alt="Home"/></Link>},
                                {key: "menuProducts", label: <Link to="/products">Products</Link>},
                                {key: "menuMyProduct", label: <Link to="/products/own">My Products</Link> },
                                {key: "menuTransactions", label: <Link to="/transactions">My Transactions</Link>},
                                {key: "menuMyOffers", label: <Link to="/offers">My Offers</Link> },
                                {key: "menuCreditCards", label: <Link to="/creditcards">My Credit Cards</Link>},
                                {key: "menuCreateProduct", label: <Link to="/products/create">Sell New Product</Link> },
                                {key: "menuDisconnect", label: <Link to="#" onClick={disconnect}>Disconnect</Link>},
                            ]}>
                            </Menu>
                        }
                    </Col>
                    <Col xs={6} sm={5} md={4} lg={3} xl={2}
                         style={{display: 'flex', flexDirection: 'row-reverse' }} >
                        { login ? (
                            <Link to={`/profile/${localStorage.getItem("userId")}`}>
                                <Avatar size="large"
                                        style={{ backgroundColor: "#ff0000", verticalAlign: 'middle', marginTop: 12  }}>
                                    { localStorage.getItem("email").charAt(0) }
                                </Avatar>
                            </Link>
                        ) : (
                            <Link to="/login"> <Text style={{ color:"#ffffff" }}>Login</Text></Link>
                        )}
                    </Col>
                </Row>
            </Header>
            <Content style={{padding: "20px 50px"}}>
                <div className="site-layout-content">
                    <Routes>
                        <Route path="/" element={
                            <HomePage />
                        } />
                        <Route path="/register" element={
                            <CreateUserComponent openNotification={openNotification}/>
                        }/>
                        <Route path="/login"  element={
                            <LoginFormComponent setLogin={setLogin} openNotification={openNotification}/>
                        }/>
                        <Route path="/products" element={
                            <ListProductsComponent/>
                        }/>
                        <Route path="/products/edit/:id" element={
                            <EditProductComponent/>
                        }/>
                        <Route path="/products/:id" element={
                            <DetailsProductComponent openNotification={openNotification}/>
                        }/>
                        <Route path="/profile/:id" element={
                            <UserProfileComponent/>
                        }/>
                        <Route path="/products/create" element={
                            <CreateProductComponent openNotification={openNotification}/>
                        }></Route>
                        <Route path="/products/own" element={
                            <ListMyProductsComponent />
                        }></Route>
                        <Route path="/transactions" element={
                            <TransactionsComponent />
                        }></Route>
                        <Route path="/creditcards" element={
                            <CreditCardsComponent openNotification={openNotification}/>
                        }></Route>
                        <Route path="/offers" element={
                            <ListMyOffers openNotification={openNotification}/>
                        }></Route>
                    </Routes>
                </div>
            </Content>

            <Footer style={{textAlign: "center"}}> Wallapep </Footer>
        </Layout>
)
}

export default App;