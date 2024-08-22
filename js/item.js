$(document).ready(function() {
    // Populate the dropdown and table on page load
    populateItemDropdown();
    populateItemTable();

    // Handle the save button click
    $('#itemSave').on('click', function(event) {
        event.preventDefault(); // Prevent default form submission

        // Collect the input values
        var name = $('#itemName').val();
        var qty = $('#itemQuantity').val(); // Changed from quantity to qty
        var price = $('#itemPrice').val();

        // Create the item object
        let item = {
            name: name,
            qty: qty, // Changed from quantity to qty
            price: price
        };

        // Convert the item object to JSON format
        let jsonItem = JSON.stringify(item);

        // Send the data with AJAX
        $.ajax({
            url: "http://localhost:8080/item", // Adjust the URL if necessary
            type: "POST",
            data: jsonItem,
            contentType: "application/json",
            success: (res) => {
                alert('Item saved successfully');
                console.log("Response from POST request:", res);

                // Clear the input fields after successful save
                $('#itemName').val('');
                $('#itemQuantity').val(''); // Changed from quantity to qty
                $('#itemPrice').val('');

                // Re-populate the dropdown and table to include the new item
                populateItemDropdown();
                populateItemTable();
            },
            error: (res) => {
                alert('Failed to save item');
                console.error("Error saving item:", res.status, res.statusText);
            }
        });
    });

    // Handle the delete button click
    $('#itemDelete').on('click', function(event) {
        event.preventDefault(); // Prevent default form submission

        // Get the selected item ID from the input field
        var itemId = $('#itemId').val();

        if (!itemId) {
            alert('Please select an item to delete.');
            return;
        }

        // Confirm the deletion
        if (confirm('Are you sure you want to delete this item?')) {
            $.ajax({
                url: `http://localhost:8080/item?id=${itemId}`, // URL to send DELETE request
                type: "DELETE",
                success: (res) => {
                    alert('Item deleted successfully');
                    console.log("Response from DELETE request:", res);

                    // Clear the input fields
                    $('#itemId').val('');
                    $('#itemName').val('');
                    $('#itemQuantity').val(''); // Changed from quantity to qty
                    $('#itemPrice').val('');

                    // Re-populate the dropdown and table to reflect the deletion
                    populateItemDropdown();
                    populateItemTable();
                },
                error: (res) => {
                    alert('Failed to delete item');
                    console.error("Error deleting item:", res.status, res.statusText);
                }
            });
        }
    });

    // Handle the update button click
    $('#itemUpdate').on('click', function(event) {
        event.preventDefault(); // Prevent default form submission

        // Get the item ID from the input field
        var itemId = $('#itemId').val();

        if (!itemId) {
            alert('Please select an item to update.');
            return;
        }

        // Collect the updated input values
        var updatedName = $('#itemName').val();
        var updatedQty = $('#itemQuantity').val(); // Changed from quantity to qty
        var updatedPrice = $('#itemPrice').val();

        // Create the updated item object
        let updatedItem = {
            name: updatedName,
            qty: updatedQty, // Changed from quantity to qty
            price: updatedPrice
        };

        // Convert the updated item object to JSON format
        let jsonUpdatedItem = JSON.stringify(updatedItem);

        // Send the updated data with AJAX
        $.ajax({
            url: `http://localhost:8080/item?id=${itemId}`, // Adjust the URL as necessary
            type: "PUT",
            data: jsonUpdatedItem,
            contentType: "application/json",
            success: (res) => {
                alert('Item updated successfully');
                console.log("Response from PUT request:", res);

                // Re-populate the dropdown and table to reflect the updated item
                populateItemDropdown();
                populateItemTable();

                // Clear the input fields after successful update
                $('#itemId').val('');
                $('#itemName').val('');
                $('#itemQuantity').val(''); // Changed from quantity to qty
                $('#itemPrice').val('');
            },
            error: (res) => {
                alert('Failed to update item');
                console.error("Error updating item:", res.status, res.statusText);
            }
        });
    });

    // Function to populate the item dropdown
    function populateItemDropdown() {
        $.ajax({
            url: "http://localhost:8080/item", // URL to get all items
            type: "GET",
            dataType: "json",
            success: (data) => {
                console.log("Data retrieved from GET request:", data);

                // Clear existing dropdown items
                $('#itemDropdownToggle').siblings('.dropdown-menu').empty();

                // Populate dropdown with item names
                data.forEach(item => {
                    $('#itemDropdownToggle').siblings('.dropdown-menu').append(
                        `<li><a class="dropdown-item" href="#" data-id="${item.id}">${item.name}</a></li>`
                    );
                });

                // Optional: add click event handler to dropdown items
                $('.dropdown-menu .dropdown-item').on('click', function() {
                    const itemId = $(this).data('id');
                    const itemName = $(this).text();
                    $('#itemDropdownToggle').text(itemName);
                    $('#itemId').val(itemId);

                    // Fetch and populate item details from the list
                    fetchAndPopulateItemDetails(data, itemId);
                });
            },
            error: (res) => {
                console.error("Error retrieving item data:", res.status, res.statusText);
            }
        });
    }

    // Function to filter and display item details
    function fetchAndPopulateItemDetails(items, itemId) {
        // Find the item by ID
        const item = items.find(i => i.id == itemId);

        if (item) {
            console.log("Item details retrieved:", item);

            // Populate the input fields with item details
            $('#itemId').val(item.id);
            $('#itemName').val(item.name);
            $('#itemQuantity').val(item.qty); // Changed from quantity to qty
            $('#itemPrice').val(item.price);
        } else {
            console.error("Item not found in the retrieved data.");
        }
    }

    // Function to populate the item table
    function populateItemTable() {
        $.ajax({
            url: "http://localhost:8080/item", // URL to get all items
            type: "GET",
            dataType: "json",
            success: (data) => {
                console.log("Data retrieved from GET request:", data);

                // Clear existing table rows
                $('#itemTable tbody').empty();

                // Populate table with item data
                data.forEach(item => {
                    $('#itemTable tbody').append(
                        `<tr>
                            <th scope="row">${item.id}</th>
                            <td>${item.name}</td>
                            <td>${item.price}</td>
                            <td>${item.qty}</td> <!-- Changed from quantity to qty -->
                        </tr>`
                    );
                });
            },
            error: (res) => {
                console.error("Error retrieving item data:", res.status, res.statusText);
            }
        });
    }
});
