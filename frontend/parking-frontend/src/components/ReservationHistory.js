// JavaScript source code
function ReservationHistory({ reservations }) {

    return (
        <div style={{ marginTop: "40px" }}>

            <h2>Reservation History</h2>

            <table border="1" cellPadding="10">

                <thead>
                    <tr>
                        <th>Reservation ID</th>
                        <th>User ID</th>
                        <th>Slot ID</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>
                    {reservations.map(reservation => (
                        <tr key={reservation.reservation_id}>
                            <td>{reservation.reservation_id}</td>
                            <td>{reservation.user_id}</td>
                            <td>{reservation.slot_id}</td>
                            <td>{reservation.status}</td>
                        </tr>
                    ))}
                </tbody>

            </table>

        </div>
    );
}

export default ReservationHistory;