/**
    $-------------------------------------------$
    |            Frontend du client 	        |
    | @name katia-client 					    |
    | @version 1.0 					   		    |
    | @license MIT 					            |
    | @link https://github.com/lalBi94/Katia    |
    | @copyright Les delices de Katia 		    |
    | @contact : bilal.boudjemline@etu.u-pec.fr |
    | @contact : ethan.brezeky@etu.u-pec.fr 	|
    $-------------------------------------------$
*/

import React from "react";
import ReactDOM from "react-dom/client";
import {
    createBrowserRouter,
    createHashRouter,
    RouterProvider,
} from "react-router-dom";
import Gate from "./pages/Gate/Gate";
import Home from "./pages/Home/Home";
import Customer from "./pages/Customer/Customer";
import Shop from "./pages/Shop/Shop";
import Cart from "./pages/Cart/Cart";
import About from "./pages/About/About";
import { ItemsPC } from "./components/ItemsPC";
import { InformationsPC } from "./components/InformationsPC";
import { UserPC } from "./components/UserPC";
import "./main.scss";
import Checkout from "./pages/Checkout/Checkout";

const router = createHashRouter([
    { path: "*", element: <Home /> },
    { path: "/", element: <Home /> },
    { path: "/home", element: <Home /> },
    { path: "/gate", element: <Gate /> },
    { path: "/customer", element: <Customer /> },
    { path: "/shop", element: <Shop /> },
    { path: "/cart", element: <Cart /> },
    { path: "/about", element: <About /> },
    { path: "/checkout", element: <Checkout /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <UserPC>
        <InformationsPC>
            <ItemsPC>
                <RouterProvider router={router} />
            </ItemsPC>
        </InformationsPC>
    </UserPC>
);
