$(document).ready(function() {
    // Variables to keep track of net total, subtotal, and discount
    let netTotal = 0;
    let subtotal = 0;
    let discount = 0;

    // Populate the dropdowns on page load
    populateCustomerDropdown();
    populateItemDropdown();

    // Function to populate the customer dropdown
    function populateCustomerDropdown() {
        $.ajax({
            url: "http://localhost:8080/customer",
            type: "GET",
            dataType: "json",
            success: (data) => {
                $('#customerDropdownMenu').empty();
                data.forEach(customer => {
                    $('#customerDropdownMenu').append(
                        `<li><a class="dropdown-item customer-item" href="#" data-id="${customer.id}">${customer.name}</a></li>`
                    );
                });
                $('.customer-item').on('click', function() {
                    const customerId = $(this).data('id');
                    fetchAndPopulateCustomerDetails(data, customerId);
                });
            },
            error: (res) => {
                console.error("Error retrieving customer data:", res.status, res.statusText);
            }
        });
    }

    function fetchAndPopulateCustomerDetails(customers, customerId) {
        const customer = customers.find(c => c.id == customerId);
        if (customer) {
            $('#cus1').val(customer.id);
            $('#cus2').val(customer.name);
            $('#cus3').val(customer.address);
            $('#cus4').val(customer.contact);
        } else {
            console.error("Customer not found in the retrieved data.");
        }
    }

    // Function to populate the item dropdown
    function populateItemDropdown() {
        $.ajax({
            url: "http://localhost:8080/item",
            type: "GET",
            dataType: "json",
            success: (data) => {
                $('#itemDropdownMenu').empty();
                data.forEach(item => {
                    $('#itemDropdownMenu').append(
                        `<li><a class="dropdown-item item-item" href="#" data-id="${item.id}">${item.name}</a></li>`
                    );
                });
                $('.item-item').on('click', function() {
                    const itemId = $(this).data('id');
                    fetchAndPopulateItemDetails(data, itemId);
                });
            },
            error: (res) => {
                console.error("Error retrieving item data:", res.status, res.statusText);
            }
        });
    }

    function fetchAndPopulateItemDetails(items, itemId) {
        const item = items.find(i => i.id == itemId);
        if (item) {
            $('#item1').val(item.id);
            $('#item2').val(item.qty); // Fill the qty input field correctly
            $('#item4').val(item.name);
            $('#item5').val(item.price);
        } else {
            console.error("Item not found in the retrieved data.");
        }
    }

    // Handler for Add to Cart button
    $('#addToCart').on('click', function(event) {
        event.preventDefault(); // Prevent form submission

        const itemId = $('#item1').val();
        const itemName = $('#item4').val();
        const itemPrice = parseFloat($('#item5').val());
        const orderQty = parseInt($('#item3').val(), 10);

        if (!itemId || !itemName || isNaN(itemPrice) || isNaN(orderQty)) {
            alert('Please fill in all fields correctly.');
            return;
        }

        // Check if order quantity exceeds available quantity
        const availableQty = parseInt($('#item2').val(), 10);
        if (orderQty > availableQty) {
            alert('Order quantity exceeds available quantity.');
            return;
        }

        // Calculate total for the item
        const total = itemPrice * orderQty;

        // Add the item to the table
        $('#orderTable tbody').append(
            `<tr>
                <td>${itemId}</td>
                <td>${itemName}</td>
                <td>${itemPrice.toFixed(2)}</td>
                <td>${orderQty}</td>
                <td>${total.toFixed(2)}</td>
            </tr>`
        );

        // Update subtotal and net total
        subtotal += total;
        netTotal += total;

        // Update the subtotal and net total fields
        $('#order1').val(subtotal.toFixed(2));
        $('#order4').val(netTotal.toFixed(2));

        // Clear item input fields after adding to cart
        $('#item1').val('');
        $('#item2').val('');
        $('#item3').val('');
        $('#item4').val('');
        $('#item5').val('');
    });

    // Handler for calculating discount and balance
    $('#order2, #order5').on('input', function() {
        const cash = parseFloat($('#order2').val()) || 0;
        const discountPercentage = parseFloat($('#order5').val()) || 0;

        if (netTotal > 0) {
            // Calculate discount as a percentage of the net total
            discount = (netTotal * discountPercentage) / 100;
            const discountedTotal = netTotal - discount;

            // Update the balance
            const balance = cash - discountedTotal;

            // Update fields
            $('#order3').val(balance.toFixed(2));
            $('#order4').val(discountedTotal.toFixed(2)); // Update net total with discount applied
        }
    });

    // Log the selected date format when a date is chosen
    $('#oDate').on('change', function() {
        const selectedDate = $(this).val();
        console.log("Selected date format (YYYY-MM-DD):", selectedDate);
    });

    // Handler for Place Order button
    $('#placeOrder').on('click', function(event) {
        event.preventDefault(); // Prevent form submission

        // Validate the date field
        const orderDate = $('#oDate').val();
        console.log("Order Date:", orderDate);
        if (!orderDate) {
            alert('Please select a date for the order.');
            return;
        }

        const orderData = {
            orderId: $('#oId').val(),
            orderDate: orderDate,
            customerId: $('#cus1').val(),
            items: [],
            netTotal: netTotal.toFixed(2),
            cash: parseFloat($('#order2').val()).toFixed(2),
            discount: discount.toFixed(2),
            balance: parseFloat($('#order3').val()).toFixed(2)
        };

        // Collect all items from the table
        $('#orderTable tbody tr').each(function() {
            const row = $(this);
            const itemId = row.find('td:eq(0)').text();
            const orderQty = row.find('td:eq(3)').text();
            const total = row.find('td:eq(4)').text();

            orderData.items.push({
                itemId: itemId,
                orderQty: orderQty,
                total: total
            });
        });
        console.log("Order Data:", JSON.stringify(orderData));

        // Send order data to the server
        $.ajax({
            url: "http://localhost:8080/order",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(orderData),
            success: (response) => {
                alert('Order placed successfully!');
                // Optionally, you can clear the form or redirect to another page
                resetOrderForm();
            },
            error: (res) => {
                alert('Failed to place the order. Please try again.');
                console.error("Error placing order:", res.status, res.statusText);
            }
        });
    });


    // Function to reset the order form
    function resetOrderForm() {
        $('#oId').val('');
        $('#oDate').val('');
        $('#cus1').val('');
        $('#cus2').val('');
        $('#cus3').val('');
        $('#cus4').val('');
        $('#order1').val('');
        $('#order2').val('');
        $('#order3').val('');
        $('#order4').val('');
        $('#order5').val('');
        $('#orderTable tbody').empty(); // Clear the order table
        netTotal = 0;
        subtotal = 0;
        discount = 0;
    }
});
