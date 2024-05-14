import "../popup.scss";
import { useState, useEffect } from "react";
import { cipherRequest } from "../../../../../../services/KTSec/KTSec";
import config from "../../../../../../global.json";
import RCode from "../../../../../../components/RCode/RCode";
import { MDBTable, MDBTableBody, MDBTableHead } from "mdbreact";
import { priceAfterPromo } from "../../../../../../services/Utils/Utils";
import { Button, Tag } from "antd";

export default function ShowReservationsActive({ handleClose }) {
    const [reservations, setReservation] = useState([]);

    const getActifReservations = () => {
        const toSend = JSON.stringify({
            token: localStorage.getItem("katiacm"),
        });

        cipherRequest(
            toSend,
            `${config.api}/reservation/getActiveReservations`
        ).then((res) => {
            const tab_columns = [
                {
                    label: "Status",
                    field: "status",
                },
                {
                    label: "Code",
                    field: "rcode",
                },
                {
                    label: "Panier",
                    field: "panier",
                },
                {
                    label: "Total",
                    field: "total",
                },
                {
                    label: "Action",
                    field: "action",
                },
            ];

            const tab_rows = [];

            for (let i = 0; i <= res.data.length - 1; ++i) {
                tab_rows.push({
                    status: (
                        <Tag color={res.data[i].status ? "#349734" : "#cb4a4a"}>
                            {res.data[i].status ? "Active" : "Inactive"}
                        </Tag>
                    ),
                    rcode: <RCode code={res.data[i].qrtxt} />,
                    panier: (
                        <div className="panier-container">
                            <ul className="panier-container-ul">
                                {Object.keys(res.data[i].items_list).map(
                                    (v, k) => (
                                        <li
                                            className="panier-container-li"
                                            key={k}
                                        >
                                            {res.data[i].items_list[v].name} (
                                            {res.data[i].items_list[v]
                                                .promotion > 0
                                                ? priceAfterPromo(
                                                      res.data[i].items_list[v]
                                                          .price,
                                                      res.data[i].items_list[v]
                                                          .promotion
                                                  ).toFixed(2)
                                                : res.data[i].items_list[v]
                                                      .price}
                                            €)
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                    ),
                    total: (
                        <span className="tab-total">{res.data[i].total}€</span>
                    ),
                    action: (
                        <div className="tab-actions">
                            <Button
                                className="tab-btn"
                                onClick={() => {
                                    handleActivate(res.data[i]._id);
                                }}
                            >
                                Activer
                            </Button>
                            <Button
                                className="tab-btn"
                                danger
                                onClick={() => {
                                    handleDesactivate(res.data[i]._id);
                                }}
                            >
                                Desactiver
                            </Button>
                        </div>
                    ),
                });
            }

            setReservation({
                columns: tab_columns,
                rows: tab_rows,
            });
        });
    };

    const handleActivate = (id) => {
        const toSend = JSON.stringify({
            token: localStorage.getItem("katiacm"),
            reservation_id: id,
        });

        cipherRequest(
            toSend,
            `${config.api}/reservation/activateReservations`
        ).then((res) => {
            if (res.status === 0) {
                getActifReservations();
            }
        });
    };

    const handleDesactivate = (id) => {
        const toSend = JSON.stringify({
            token: localStorage.getItem("katiacm"),
            reservation_id: id,
        });

        cipherRequest(
            toSend,
            `${config.api}/reservation/desactivateReservations`
        ).then((res) => {
            if (res.status === 0) {
                getActifReservations();
            }
        });
    };

    useEffect(() => {
        getActifReservations();
    }, []);

    return (
        <div className="popup-container">
            {reservations.rows ? (
                <div id="popup-table-container">
                    <MDBTable responsive={true}>
                        <MDBTableHead columns={reservations.columns} />
                        <MDBTableBody
                            rows={reservations.rows}
                            color="#ff0000"
                        />
                    </MDBTable>
                </div>
            ) : null}

            <div className="popup-btn-container">
                <Button className="" danger onClick={handleClose}>
                    Quitter
                </Button>
            </div>
        </div>
    );
}
