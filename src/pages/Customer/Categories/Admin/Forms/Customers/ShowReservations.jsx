import { useEffect, useState } from "react";
import { cipherRequest } from "../../../../../../services/KTSec/KTSec";
import "../popup.scss";
import config from "../../../../../../global.json";
import { MDBTable, MDBTableBody, MDBTableHead } from "mdbreact";
import RCode from "../../../../../../components/RCode/RCode";
import { priceAfterPromo } from "../../../../../../services/Utils/Utils";
import { Input, Button, Tag, notification } from "antd";

export default function ShowReservation({ handleClose }) {
    const [users, setUsers] = useState({});
    const [selectedUser, setSelectedUser] = useState({});
    const [reservations, setReservations] = useState([]);
    const [notif, notifContext] = notification.useNotification();

    useEffect(() => {
        const toSend = JSON.stringify({
            token: localStorage.getItem("katiacm"),
        });

        cipherRequest(toSend, `${config.api}/customer/getAllUsers`).then(
            (res) => {
                setUsers(res.data);
            }
        );
    }, []);

    /**
     * Ouvrir la Notif
     * @param {string} title Titre de la popup (non implemente encore)
     * @param {string} message Le contenu
     * @param {0|1} status 1: Erreur 0: Succes
     * @param {string} placement topLeft, ...
     */
    const openNotif = (title, message, status, placement) => {
        notif[status === 0 ? "success" : status === 1 ? "error" : "info"]({
            message: title,
            description: message,
            placement,
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
                handleSelect(selectedUser);
                openNotif(
                    "Administration",
                    "Reservation re-active avec succes",
                    0,
                    "topLeft"
                );
            } else {
                openNotif(
                    "Administration",
                    "Une erreur est survenue",
                    1,
                    "topLeft"
                );
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
                handleSelect(selectedUser);
                openNotif(
                    "Administration",
                    "Reservation desactive avec succes",
                    0,
                    "topLeft"
                );
            } else {
                openNotif(
                    "Administration",
                    "Une erreur est survenue",
                    1,
                    "topLeft"
                );
            }
        });
    };

    const handleSelect = (user) => {
        console.log(user);

        const toSend = JSON.stringify({
            token: localStorage.getItem("katiacm"),
            userId: user._id,
        });

        cipherRequest(toSend, `${config.api}/reservation/getReservationsOf`)
            .then((res) => {
                const cpy2 = { ...user };
                cpy2.reservations = res.data;
                return cpy2;
            })
            .then((res2) => {
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
                        label: "Total",
                        field: "total",
                    },
                    {
                        label: "Panier",
                        field: "panier",
                    },
                    {
                        label: "Action",
                        field: "action",
                    },
                ];

                const tab_rows = [];

                for (let i = 0; i <= res2.reservations.length - 1; ++i) {
                    tab_rows.push({
                        status: (
                            <Tag
                                color={
                                    res2.reservations[i].status
                                        ? "#349734"
                                        : "#cb4a4a"
                                }
                            >
                                {res2.reservations[i].status
                                    ? "Active"
                                    : "Non-active"}
                            </Tag>
                        ),
                        rcode: <RCode code={res2.reservations[i].qrtxt} />,
                        total: (
                            <span className="tab-total">
                                {res2.reservations[i].total}€
                            </span>
                        ),
                        panier: (
                            <div className="panier-container">
                                <ul className="panier-container-ul">
                                    {Object.keys(
                                        res2.reservations[i].items_list
                                    ).map((v, k) => (
                                        <li
                                            className="panier-container-li"
                                            key={k}
                                        >
                                            {
                                                res2.reservations[i].items_list[
                                                    v
                                                ].name
                                            }{" "}
                                            (
                                            {res2.reservations[i].items_list[v]
                                                .promotion > 0
                                                ? priceAfterPromo(
                                                      res2.reservations[i]
                                                          .items_list[v].price,
                                                      res2.reservations[i]
                                                          .items_list[v]
                                                          .promotion
                                                  ).toFixed(2)
                                                : res2.reservations[i]
                                                      .items_list[v].price}
                                            €)
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ),
                        action: (
                            <div className="tab-actions">
                                <Button
                                    className=""
                                    onClick={() => {
                                        handleActivate(
                                            res2.reservations[i]._id
                                        );
                                    }}
                                >
                                    Activer
                                </Button>
                                <Button
                                    className="tab-btn"
                                    danger
                                    onClick={() => {
                                        handleDesactivate(
                                            res2.reservations[i]._id
                                        );
                                    }}
                                >
                                    Desactiver
                                </Button>
                            </div>
                        ),
                    });
                }

                setReservations({ columns: tab_columns, rows: tab_rows });
                setSelectedUser(res2);
            });
    };

    const handleDesactivateReservation = (id) => {
        const toSend = JSON.stringify({
            token: localStorage.getItem("katiacm"),
            reservation_id: id,
        });

        cipherRequest(
            toSend,
            `${config.api}/reservation/desactivateReservations`
        ).then((res) => {
            if (res.status === 0) {
                for (
                    let i = 0;
                    i <= selectedUser.reservations.length - 1;
                    ++i
                ) {
                    if (selectedUser.reservations[i]._id === id) {
                        const cpy = { ...selectedUser };
                        cpy.reservations[i].status = false;
                        setSelectedUser(cpy);
                        break;
                    }
                }
            }
        });
    };

    const handleActivateReservation = (id) => {
        const toSend = JSON.stringify({
            token: localStorage.getItem("katiacm"),
            reservation_id: id,
        });

        cipherRequest(
            toSend,
            `${config.api}/reservation/activateReservations`
        ).then((res) => {
            if (res.status === 0) {
                for (
                    let i = 0;
                    i <= selectedUser.reservations.length - 1;
                    ++i
                ) {
                    if (selectedUser.reservations[i]._id === id) {
                        const cpy = { ...selectedUser };
                        cpy.reservations[i].status = true;
                        setSelectedUser(cpy);
                        break;
                    }
                }
            }
        });
    };

    const handleBack = () => {
        setSelectedUser({});
    };

    return users.length > 0 ? (
        <div className="popup-container">
            {notifContext}
            <div className="popup-list-w-actions">
                {users.length > 0
                    ? Object.keys(users).map((v, k) => (
                          <div
                              className={`popup-list-data ${
                                  selectedUser._id === users[v]._id
                                      ? "active"
                                      : ""
                              }`}
                              key={k}
                              onClick={() => {
                                  handleSelect(users[v]);
                              }}
                          >
                              <span className="popup-list-data-name">
                                  {users[v].firstname} {users[v].lastname}
                              </span>

                              <span className="popup-list-data-lower">
                                  #{users[v]._id}
                              </span>
                          </div>
                      ))
                    : null}
            </div>

            {selectedUser._id ? (
                <div id="popup-table-container">
                    <MDBTable responsive={true}>
                        <MDBTableHead columns={reservations.columns} />
                        <MDBTableBody rows={reservations.rows} />
                    </MDBTable>
                </div>
            ) : null}

            <div className="popup-btn-container">
                <Button danger className="" onClick={handleClose}>
                    Quitter
                </Button>
                <Button danger className="" onClick={handleBack}>
                    Retour
                </Button>
            </div>
        </div>
    ) : null;
}
