import React, { useEffect, useState } from "react";

import api from "./services/api";
import { loginUser, registerUser } from "./services/authService";

import { QRCodeCanvas } from "qrcode.react";

import QRScanner from "./components/QRScanner";
import Login from "./components/Login";
import Register from "./components/Register";
import ParkingGrid from "./components/ParkingGrid";
import AdminPanel from "./components/AdminPanel";
import ReservationHistory from "./components/ReservationHistory";

function App() {

    // ================= STATES =================
    const [slots, setSlots] = useState([]);
    const [reservations, setReservations] = useState([]);

    const [token, setToken] = useState(localStorage.getItem("token"));

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const [isRegistering, setIsRegistering] = useState(false);

    const [newSlotNumber, setNewSlotNumber] = useState("");

    const [selectedQr, setSelectedQr] = useState("");

    const [showScanner, setShowScanner] = useState(false);

    const [scannerAction, setScannerAction] = useState("");

    const [selectedSlotId, setSelectedSlotId] = useState(null);

    // ================= TOKEN HELPERS =================
    const getUserIdFromToken = () => {

        if (!token) return null;

        const payload = JSON.parse(atob(token.split('.')[1]));

        return payload.user_id;
    };

    const getRoleFromToken = () => {

        if (!token) return null;

        const payload = JSON.parse(atob(token.split('.')[1]));

        return payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    };

    // ================= USER SLOT HELPERS =================
    const getUserReservedSlot = () => {

        console.log(slots);

        return slots.find(
            slot => slot.status?.trim() === "Reserved"
        );
    };

    const getUserOccupiedSlot = () => {

        return slots.find(
            slot => slot.status?.trim() === "Occupied"
        );
    };

    // ================= LOGIN =================
    const login = async () => {

        try {

            const data = await loginUser(email, password);

            localStorage.setItem("token", data.token);

            setToken(data.token);

        } catch {
            alert("Invalid login");
        }
    };

    // ================= REGISTER =================
    const register = async () => {

        try {

            await registerUser(name, email, password);

            alert("Registered successfully!");

            setIsRegistering(false);

        } catch (err) {

            alert(err.response.data);
        }
    };

    // ================= LOAD DATA =================
    useEffect(() => {

        if (token) {

            api.get("/ParkingSlots")
                .then(res => {

                    setSlots(res.data);

                    api.get("/ParkingSlots/reservation-history")
                        .then(res => {

                            console.log(res.data);

                            setReservations(res.data);
                        })
                        .catch(err => console.error(err));
                })
                .catch(err => console.error(err));
        }

    }, [token]);

    // ================= RESERVE =================
    const reserve = (slotId) => {

        api.post(
            `/ParkingSlots/reserve?slotId=${slotId}&userId=${getUserIdFromToken()}`
        )
            .then(() => {

                alert("Reserved!");

                window.location.reload();

            })
            .catch(err => console.error(err));
    };

    // ================= CHECK IN =================
    const checkIn = (slotId) => {

        api.post(
            `/ParkingSlots/checkin?slotId=${slotId}&userId=${getUserIdFromToken()}`
        )
            .then(() => {

                alert("Checked In!");

                window.location.reload();

            })
            .catch(err => console.error(err));
    };

    // ================= CHECK OUT =================
    const checkOut = (slotId) => {

        api.post(
            `/ParkingSlots/checkout?slotId=${slotId}&userId=${getUserIdFromToken()}`
        )
            .then(() => {

                alert("Checked Out!");

                window.location.reload();

            })
            .catch(err => console.error(err));
    };

    // ================= ADMIN =================
    const updateSlotStatus = (slotId, status) => {

        api.put(
            `/ParkingSlots/update-status?slotId=${slotId}&status=${status}`
        )
            .then(() => {

                alert("Slot updated!");

                window.location.reload();

            })
            .catch(err => console.error(err));
    };

    const addSlot = () => {

        api.post(
            `/ParkingSlots/add-slot?slotNumber=${newSlotNumber}`
        )
            .then(() => {

                alert("Slot added!");

                window.location.reload();

            })
            .catch(err => console.error(err));
    };

    const deleteSlot = (slotId) => {

        api.delete(
            `/ParkingSlots/delete-slot?slotId=${slotId}`
        )
            .then(() => {

                alert("Slot deleted!");

                window.location.reload();

            })
            .catch(err => console.error(err));
    };

    // ================= QR SCAN =================
    const handleQrScan = (decodedText) => {

        try {

            const qrData = JSON.parse(decodedText);

            const slot = slots.find(
                s => s.slot_number === qrData.slotNumber
            );

            // QR DOES NOT MATCH ANY SLOT
            if (!slot) {

                alert("Invalid parking QR code.");

                return;
            }

            // QR DOES NOT MATCH USER RESERVED SLOT
            console.log("QR Slot:", slot.slot_id);
            console.log("Selected Slot:", selectedSlotId);

            if (parseInt(slot.slot_id) !== parseInt(selectedSlotId)) {

                alert(
                    "QR code does not match your reserved parking slot."
                );

                return;
            }

            // CHECK IN
            if (scannerAction === "checkin") {

                checkIn(slot.slot_id);

                return;
            }

            // CHECK OUT
            if (scannerAction === "checkout") {

                checkOut(slot.slot_id);

                return;
            }

        } catch {

            alert("Invalid QR format.");
        }
    };
    // ================= LOGIN / REGISTER UI =================
    if (!token) {

        if (isRegistering) {

            return (
                <Register
                    name={name}
                    email={email}
                    password={password}
                    setName={setName}
                    setEmail={setEmail}
                    setPassword={setPassword}
                    register={register}
                    setIsRegistering={setIsRegistering}
                />
            );
        }

        return (
            <Login
                email={email}
                password={password}
                setEmail={setEmail}
                setPassword={setPassword}
                login={login}
                setIsRegistering={setIsRegistering}
            />
        );
    }

    // ================= MAIN UI =================
    return (
        <div style={{ padding: "20px" }}>

            <h1>Parking Slot Monitoring System</h1>

            {getRoleFromToken() === "2" && (
                <h2>Admin Dashboard</h2>
            )}

            {getRoleFromToken() !== "2" && (
                <h2>User Dashboard</h2>
            )}

            <p>
                Logged in User ID: {getUserIdFromToken()}
            </p>

            <button
                onClick={() => {

                    localStorage.removeItem("token");

                    setToken(null);
                }}
                style={{ marginBottom: "20px" }}
            >
                Logout
            </button>

            {/* ================= QR MODAL ================= */}

            {selectedQr && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0,0,0,0.7)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 999
                    }}
                >

                    <div
                        style={{
                            backgroundColor: "white",
                            padding: "30px",
                            borderRadius: "10px",
                            textAlign: "center"
                        }}
                    >

                        <h2>Parking Slot QR</h2>

                        <QRCodeCanvas
                            value={selectedQr}
                            size={300}
                        />

                        <br /><br />

                        <button
                            onClick={() => setSelectedQr("")}
                        >
                            Close
                        </button>

                    </div>

                </div>
            )}

            {/* ================= SCANNER MODAL ================= */}

            <div
                style={{
                    display: showScanner ? "flex" : "none",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0,0,0,0.7)",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 999
                }}
            >

                <div
                    style={{
                        backgroundColor: "white",
                        padding: "20px",
                        borderRadius: "10px"
                    }}
                >

                    <QRScanner
                        onScanSuccess={(decodedText) => {

                            handleQrScan(decodedText);

                            setShowScanner(false);
                        }}
                    />

                    <br />

                    <button
                        onClick={() => setShowScanner(false)}
                    >
                        Close Scanner
                    </button>

                </div>

            </div>

            {/* ================= USER ACTIONS ================= */}

            {getRoleFromToken() !== "2" && getUserReservedSlot() && (
                <div style={{ marginBottom: "20px" }}>

                    <button
                        onClick={() => {

                            setSelectedSlotId(
                                getUserReservedSlot().slot_id
                            );

                            setScannerAction("checkin");

                            setShowScanner(true);
                        }}
                    >
                        Check-In
                    </button>

                </div>
            )}

            {getRoleFromToken() !== "2" && getUserOccupiedSlot() && (
                <div style={{ marginBottom: "20px" }}>

                    <button
                        onClick={() => {

                            setSelectedSlotId(
                                getUserOccupiedSlot().slot_id
                            );

                            setScannerAction("checkout");

                            setShowScanner(true);
                        }}
                    >
                        Check-Out
                    </button>

                </div>
            )}

            {/* ================= ADMIN PANEL ================= */}

            {getRoleFromToken() === "2" && (
                <AdminPanel
                    newSlotNumber={newSlotNumber}
                    setNewSlotNumber={setNewSlotNumber}
                    addSlot={addSlot}
                />
            )}

            <br />

          

            <p>
                Reserved Slot:
                {getUserReservedSlot() ? "YES" : "NO"}
            </p>

            <p>
                Occupied Slot:
                {getUserOccupiedSlot() ? "YES" : "NO"}
            </p>

            {/* ================= GRID ================= */}

            <ParkingGrid
                slots={slots}
                reserve={reserve}
                getRoleFromToken={getRoleFromToken}
                updateSlotStatus={updateSlotStatus}
                deleteSlot={deleteSlot}
                selectedQr={selectedQr}
                setSelectedQr={setSelectedQr}
                getUserIdFromToken={getUserIdFromToken}
                reservations={reservations}
            />

            {/* ================= HISTORY ================= */}

            {getRoleFromToken() === "2" && (
                <ReservationHistory
                    reservations={reservations}
                />
            )}

        </div>
    );
}

export default App;