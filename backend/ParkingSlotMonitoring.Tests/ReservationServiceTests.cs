using Xunit;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using ParkingSlotMonitoring.API.Data;
using ParkingSlotMonitoring.API.Models;
using Microsoft.AspNetCore.Mvc;

public class ReservationServiceTests
{
    private AppDbContext GetDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new AppDbContext(options);
    }

    [Fact]
    public void ReserveSlot_ShouldReserveAvailableSlot()
    {
        // Arrange
        var context = GetDbContext();

        context.ParkingSlots.Add(new ParkingSlot
        {
            slot_id = 1,
            slot_number = "A1",
            status = "Available",
            area_id = 1,
            row_number = 1,
            column_number = 1
        });

        context.SaveChanges();

        var controller = new ParkingSlotsController(context);

        // Act
        var result = controller.ReserveSlot(1, 100);

        // Assertd
        result.Should().BeOfType<OkObjectResult>();

        var slot = context.ParkingSlots.FirstOrDefault(s => s.slot_id == 1);

        slot.status.Should().Be("Reserved");

        context.Reservations.Count().Should().Be(1);
    }

    [Fact]
    public void ReserveSlot_ShouldFail_WhenSlotNotAvailable()
    {
        // Arrange
        var context = GetDbContext();

        context.ParkingSlots.Add(new ParkingSlot
        {
            slot_id = 1,
            slot_number = "A1",
            status = "Occupied",
            area_id = 1,
            row_number = 1,
            column_number = 1
        });

        context.SaveChanges();

        var controller = new ParkingSlotsController(context);

        // Act
        var result = controller.ReserveSlot(1, 100);

        // Assert
        result.Should().BeOfType<BadRequestObjectResult>();

        context.Reservations.Count().Should().Be(0);
    }

    [Fact]
    public void CheckIn_ShouldUpdateStatusesCorrectly()
    {
        // Arrange
        var context = GetDbContext();

        context.ParkingSlots.Add(new ParkingSlot
        {
            slot_id = 1,
            slot_number = "A1",
            status = "Reserved",
            area_id = 1,
            row_number = 1,
            column_number = 1
        });

        context.Reservations.Add(new Reservation
        {
            reservation_id = 1,
            user_id = 100,
            slot_id = 1,
            start_time = DateTime.Now,
            end_time = DateTime.Now,
            status = "Reserved",
            total_amount = 0
        });

        context.SaveChanges();

        var controller = new ParkingSlotsController(context);

        // Act
        var result = controller.CheckIn(1, 100);

        // Assert
        result.Should().BeOfType<OkObjectResult>();

        var slot = context.ParkingSlots.FirstOrDefault(s => s.slot_id == 1);

        var reservation = context.Reservations.FirstOrDefault(r => r.slot_id == 1);

        slot.status.Should().Be("Occupied");

        reservation.status.Should().Be("CheckedIn");
    }

    [Fact]
    public void CheckOut_ShouldFreeParkingSlot()
    {
        // Arrange
        var context = GetDbContext();

        context.ParkingSlots.Add(new ParkingSlot
        {
            slot_id = 1,
            slot_number = "A1",
            status = "Occupied",
            area_id = 1,
            row_number = 1,
            column_number = 1
        });

        context.Reservations.Add(new Reservation
        {
            reservation_id = 1,
            user_id = 100,
            slot_id = 1,
            start_time = DateTime.Now,
            end_time = DateTime.Now,
            status = "CheckedIn",
            total_amount = 0
        });

        context.SaveChanges();

        var controller = new ParkingSlotsController(context);

        // Act
        var result = controller.CheckOut(1, 100);

        // Assert
        result.Should().BeOfType<OkObjectResult>();

        var slot = context.ParkingSlots.FirstOrDefault(s => s.slot_id == 1);

        var reservation = context.Reservations.FirstOrDefault(r => r.slot_id == 1);

        slot.status.Should().Be("Available");

        reservation.status.Should().Be("Completed");
    }
}