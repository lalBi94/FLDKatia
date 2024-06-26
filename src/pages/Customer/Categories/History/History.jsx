import { useEffect, useState } from "react";
import config from "../../../../global.json";
import { MDBTable, MDBTableBody, MDBTableHead } from "mdbreact";
import RCode from "../../../../components/RCode/RCode";
import { priceAfterPromo } from "../../../../services/Utils/Utils";
import { cipherRequest } from "../../../../services/KTSec/KTSec";
import "./History.scss";
import { Vortex } from "react-loader-spinner";

export default function History() {
    const [reservations, setReservation] = useState([]);
    const [loader, setLoader] = useState(true);

    useEffect(() => {
        const toSend = JSON.stringify({
            token: localStorage.getItem("katiacm"),
        });

        cipherRequest(
            toSend,
            `${config.api}/reservation/getConfirmedReservationsOf`
        ).then((res) => {
            if (!res.data) {
                setLoader(false);
                return;
            }

            const tab_columns = [
                {
                    label: "QR Code",
                    field: "qrcode",
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
            ];

            const tab_rows = [];

            for (let i = 0; i <= res.data.length - 1; ++i) {
                tab_rows.push({
                    qrcode: <img src={res.data[i].qrcode}></img>,
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
                    action: <div className="tab-actions"></div>,
                });
            }

            setLoader(false);
            setReservation({ columns: tab_columns, rows: tab_rows });
        });
    }, []);

    return (
        <div id="history-container">
            <div id="history-header-container">
                <h3>Vos précédents achats</h3>
            </div>

            {loader ? (
                <div className="loader">
                    <Vortex
                        visible={true}
                        height="100"
                        width="100"
                        radius={1}
                        ariaLabel="vortex-loading"
                        wrapperStyle={{}}
                        wrapperClass="vortex-wrapper"
                        colors={[
                            "#cbfff3",
                            "#d5ffcf",
                            "#cbfff3",
                            "#d5ffcf",
                            "#cbfff3",
                            "#d5ffcf",
                        ]}
                    />
                </div>
            ) : null}

            {reservations.columns ? (
                <MDBTable responsive={true}>
                    <MDBTableHead columns={reservations.columns} />
                    <MDBTableBody rows={reservations.rows} color="#ff0000" />
                </MDBTable>
            ) : null}
        </div>
    );
}
