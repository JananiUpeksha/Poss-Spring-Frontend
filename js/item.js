$(document).ready(function() {
    // Populate the dropdown and table on page load
    populateItemDropdown();
    populateItemTable();

    // Handle the save button click
    $('#itemSave').on('click', function(event) {
        event.preventDefault();

        // Collect the input values
        var name = $('#itemName').val();
        var qty = $('#itemQuantity').val();
        var price = $('#itemPrice').val();

        // Create the item object
        let item = {
            name: name,
            qty: qty,
            price: price
        };

        // Convert the item object to JSON format
        let jsonItem = JSON.stringify(item);

        // Send the data with AJAX
        $.ajax({
            url: "http://localhost:8080/api/v1/item", // Updated URL to match the controller
            type: "POST",
            data: jsonItem,
            contentType: "application/json",
            success: (res) => {
                alert('Item saved successfully');
                console.log("Response from POST request:", res);
                clearInputFields();
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
        event.preventDefault();

        var itemId = $('#itemId').val();
        if (!itemId) {
            alert('Please select an item to delete.');
            return;
        }

        if (confirm('Are you sure you want to delete this item?')) {
            $.ajax({
                url: `http://localhost:8080/api/v1/item/${itemId}`, // Updated URL
                type: "DELETE",
                success: (res) => {
                    alert('Item deleted successfully');
                    console.log("Response from DELETE request:", res);
                    clearInputFields();
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
        event.preventDefault();

        var itemId = $('#itemId').val();
        if (!itemId) {
            alert('Please select an item to update.');
            return;
        }

        var updatedName = $('#itemName').val();
        var updatedQty = $('#itemQuantity').val();
        var updatedPrice = $('#itemPrice').val();

        let updatedItem = {
            name: updatedName,
            qty: updatedQty,
            price: updatedPrice
        };

        let jsonUpdatedItem = JSON.stringify(updatedItem);

        $.ajax({
            url: `http://localhost:8080/api/v1/item/${itemId}`, // Updated URL
            type: "PUT",
            data: jsonUpdatedItem,
            contentType: "application/json",
            success: (res) => {
                alert('Item updated successfully');
                console.log("Response from PUT request:", res);
                populateItemDropdown();
                populateItemTable();
                clearInputFields();
            },
            error: (res) => {
                alert('Failed to update item');
                console.error("Error updating item:", res.status, res.statusText);
            }
        });
    });

    function clearInputFields() {
        $('#itemId').val('');
        $('#itemName').val('');
        $('#itemQuantity').val('');
        $('#itemPrice').val('');
    }

    function populateItemDropdown() {
        $.ajax({
            url: "http://localhost:8080/api/v1/item", // Updated URL
            type: "GET",
            dataType: "json",
            success: (data) => {
                console.log("Data retrieved from GET request:", data);
                $('#itemDropdownToggle').siblings('.dropdown-menu').empty();
                data.forEach(item => {
                    $('#itemDropdownToggle').siblings('.dropdown-menu').append(
                        `<li><a class="dropdown-item" href="#" data-id="${item.id}">${item.name}</a></li>`
                    );
                });
                $('.dropdown-menu .dropdown-item').on('click', function() {
                    const itemId = $(this).data('id');
                    const itemName = $(this).text();
                    $('#itemDropdownToggle').text(itemName);
                    $('#itemId').val(itemId);
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
            $('#itemId').val(item.id);
            $('#itemName').val(item.name);
            $('#itemQuantity').val(item.qty);
            $('#itemPrice').val(item.price);
        } else {
            console.error("Item not found in the retrieved data.");
        }
    }

    function populateItemTable() {
        $.ajax({
            url: "http://localhost:8080/api/v1/item", // Updated URL
            type: "GET",
            dataType: "json",
            success: (data) => {
                console.log("Data retrieved from GET request:", data);
                $('#itemTable tbody').empty();
                data.forEach(item => {
                    $('#itemTable tbody').append(
                        `<tr>
                            <th scope="row">${item.id}</th>
                            <td>${item.name}</td>
                            <td>${item.price}</td>
                            <td>${item.qty}</td>
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
