import { QRCodeCanvas } from "qrcode.react";

function ParkingGrid({
    slots,
    reserve,
    checkIn,
    checkOut,
    getRoleFromToken,
    updateSlotStatus,
    deleteSlot,
    selectedQr,
    setSelectedQr,
    getUserIdFromToken,
    reservations

}) {

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 120px)",
                gap: "15px"
            }}
        >
            {slots.map(slot => (
                <div
                    key={slot.slot_id}
                    style={{
                        border: "1px solid black",
                        padding: "20px",
                        textAlign: "center",
                        backgroundColor:
                            slot.status === "Available"
                                ? "lightgreen"
                                : slot.status === "Reserved"
                                    ? "yellow"
                                    : "red"
                    }}
                >
                    <div>{slot.slot_number}</div>

                    <div>

                        {slot.status === "Reserved" && reservations.some(
                            r =>
                                r.slot_id === slot.slot_id &&
                                r.user_id === parseInt(getUserIdFromToken()) &&
                                r.status === "Reserved"
                        )

                            ? "Reserved By You"

                            : slot.status === "Reserved"

                                ? "Reserved By Other User"

                                : slot.status}

                    </div>

                 

                    <br />

                    {reservations.some(
                        r =>
                            r.slot_id === slot.slot_id &&
                            r.user_id === parseInt(getUserIdFromToken()) &&
                            r.status === "Reserved"
                    ) && (

                            <button
                                onClick={() =>
                                    setSelectedQr(
                                        JSON.stringify({
                                            slotNumber: slot.slot_number
                                        })
                                    )
                                }
                            >
                                Show QR
                            </button>

                        )}

                    <br />

                    {getRoleFromToken() === "2" && (
                        <div>

                            <button
                                onClick={() => updateSlotStatus(slot.slot_id, "Available")}
                            >
                                Set Available
                            </button>

                            <br /><br />

                            <button
                                onClick={() => updateSlotStatus(slot.slot_id, "Reserved")}
                            >
                                Set Reserved
                            </button>

                            <br /><br />

                            <button
                                onClick={() => updateSlotStatus(slot.slot_id, "Occupied")}
                            >
                                Set Occupied
                            </button>

                            <br /><br />

                            <button
                                onClick={() => deleteSlot(slot.slot_id)}
                            >
                                Delete Slot
                            </button>

                            <br /><br />

                        </div>
                    )}

                    {getRoleFromToken() !== "2" && (
                        <>

                            {slot.status === "Available"
                                && !reservations.some(
                                    r =>
                                        r.user_id === parseInt(getUserIdFromToken())
                                ) && (
                                <button onClick={() => reserve(slot.slot_id)}>
                                    Reserve
                                </button>
                            )}

                        </>
                    )}
                </div>
            ))}
        </div>
    );
}

export default ParkingGrid;