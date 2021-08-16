import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Arrived from "./components/Arrived.js";
import AsideMenu from "./components/AsideMenu.js";
import Browse from "./components/Browse.js";
import Clients from "./components/Clients.js";
import Footer from "./components/Footer.js";
import Header from "./components/Header.js";
import Hero from "./components/Hero.js";
import Offline from "./components/Offline.js";
import Cart from "./pages/Cart.js";
import Details from "./pages/Details.js";
import Profile from "./pages/Profile.js";
import Splash from "./pages/Splash.js";

function App({ cart }) {
    const [items, setItems] = React.useState([]);
    const [offlineStatus, setOfflineStatus] = React.useState(!navigator.onLine);
    const [isLoading, setIsLoading] = React.useState(true);

    function handleOfflineStatus() {
        setOfflineStatus(!navigator.onLine);
    }

    React.useEffect(
        function () {
            (async function () {
                const response = await fetch(
                    "https://prod-qore-app.qorebase.io/8ySrll0jkMkSJVk/allItems/rows?limit=7&offset=0&$order=asc",
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                            "x-api-key": process.env.REACT_APP_APIKEY,
                        },
                    }
                );

                const { nodes } = await response.json();
                setItems(nodes);
            })();

            handleOfflineStatus();
            window.addEventListener("online", handleOfflineStatus);
            window.addEventListener("offline", handleOfflineStatus);

            setTimeout(() => {
                setIsLoading(false);

                const script = document.createElement("script");
                script.src = "/carousel.js";
                script.async = false;
                document.body.appendChild(script);
            }, 1500);

            return function () {
                window.removeEventListener("online", handleOfflineStatus);
                window.removeEventListener("offline", handleOfflineStatus);
            };
        },
        [offlineStatus]
    );
    return (
        <>
            {isLoading ? (
                <Splash></Splash>
            ) : (
                <>
                    {offlineStatus && <Offline></Offline>}
                    <Header mode="light" cart={cart}></Header>
                    <Hero></Hero>
                    <Browse></Browse>
                    <Arrived items={items}></Arrived>
                    <Clients></Clients>
                    <AsideMenu></AsideMenu>
                    <Footer></Footer>
                </>
            )}
        </>
    );
}

export default function Routes() {
    const cachedCart = window.localStorage.getItem("cart");
    const [cart, setCart] = React.useState([]);

    function handleAddToCart(item) {
        const currentIndex = cart.length;
        const newCart = [...cart, { id: currentIndex + 1, item }];
        setCart(newCart);
        window.localStorage.setItem("cart", JSON.stringify(newCart));
    }

    function handleRemoveCartItem(id) {
        const revisedCart = cart.filter(function (item) {
            return item.id !== id;
        });

        setCart(revisedCart);
        window.localStorage.setItem("cart", JSON.stringify(revisedCart));
    }

    React.useEffect(
        function () {
            console.info("useEffect for localStorage");
            if (cachedCart !== null) {
                setCart(JSON.parse(cachedCart));
            }
        },
        [cachedCart]
    );

    return (
        <Router>
            <Route path="/" exact>
                <App cart={cart}></App>
            </Route>
            <Route path="/profile" exact component={Profile}></Route>
            <Route path="/details/:id">
                <Details
                    handleAddToCart={handleAddToCart}
                    cart={cart}></Details>
            </Route>
            <Route path="/cart">
                <Cart
                    cart={cart}
                    handleRemoveCartItem={handleRemoveCartItem}></Cart>
            </Route>
        </Router>
    );
}
