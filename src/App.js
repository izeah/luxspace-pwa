import React from "react";
import Header from "./components/Header.js";
import Hero from "./components/Hero.js";
import Browse from "./components/Browse.js";
import Arrived from "./components/Arrived.js";
import Clients from "./components/Clients.js";
import AsideMenu from "./components/AsideMenu.js";
import Footer from "./components/Footer.js";

function App() {
    const [items, setItems] = React.useState([]);

    React.useEffect(function () {
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
    }, []);
    return (
        <>
            <Header></Header>
            <Hero></Hero>
            <Browse></Browse>
            <Arrived items={items}></Arrived>
            <Clients></Clients>
            <AsideMenu></AsideMenu>
            <Footer></Footer>
        </>
    );
}

export default App;
