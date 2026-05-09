function AdminPanel({
    newSlotNumber,
    setNewSlotNumber,
    addSlot
}) {

    return (
        <div style={{ marginBottom: "20px" }}>

            <h3>Add Parking Slot</h3>

            <input
                placeholder="Slot Number"
                value={newSlotNumber}
                onChange={e => setNewSlotNumber(e.target.value)}
            />

            <button onClick={addSlot}>
                Add Slot
            </button>

        </div>
    );
}

export default AdminPanel;