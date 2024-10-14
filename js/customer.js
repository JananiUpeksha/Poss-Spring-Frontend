$(document).ready(function() {
    // Populate the dropdown and table on page load
    populateCustomerDropdown();
    populateCustomerTable();

    // Handle the save button click
    $('#cusSave').on('click', function(event) {
        event.preventDefault();

        // Collect the input values
        var name = $('#cusName').val();
        var address = $('#cusAddress').val();
        var contact = $('#cusContact').val();

        // Create the customer object
        let customer = {
            name: name,
            address: address,
            contact: contact
        };

        // Convert the customer object to JSON format
        let jsonCustomer = JSON.stringify(customer);

        // Send the data with AJAX
        $.ajax({
            url: "http://localhost:8080/api/v1/customer", // Updated URL
            type: "POST",
            data: jsonCustomer,
            contentType: "application/json",
            success: (res) => {
                alert('Customer saved successfully');
                console.log("Response from POST request:", res);

                // Clear the input fields
                $('#cusName').val('');
                $('#cusAddress').val('');
                $('#cusContact').val('');

                // Re-populate the dropdown and table
                populateCustomerDropdown();
                populateCustomerTable();
            },
            error: (res) => {
                alert('Failed to save customer');
                console.error("Error saving customer:", res.status, res.statusText);
            }
        });
    });

    // Handle the delete button click
    $('#cusDelete').on('click', function(event) {
        event.preventDefault();

        // Get the selected customer ID from the input field
        var customerID = $('#cusId').val();

        if (!customerID) {
            alert('Please select a customer to delete.');
            return;
        }

        // Confirm the deletion
        if (confirm('Are you sure you want to delete this customer?')) {
            $.ajax({
                url: `http://localhost:8080/api/v1/customer/${customerID}`, // Updated URL
                type: "DELETE",
                success: (res) => {
                    alert('Customer deleted successfully');
                    console.log("Response from DELETE request:", res);

                    // Clear the input fields
                    $('#cusId').val('');
                    $('#cusName').val('');
                    $('#cusAddress').val('');
                    $('#cusContact').val('');

                    // Re-populate the dropdown and table
                    populateCustomerDropdown();
                    populateCustomerTable();
                },
                error: (res) => {
                    alert('Failed to delete customer');
                    console.error("Error deleting customer:", res.status, res.statusText);
                }
            });
        }
    });

    // Handle the update button click
    $('#cusUpdate').on('click', function(event) {
        event.preventDefault();

        // Get the customer ID from the input field
        var customerId = $('#cusId').val();

        if (!customerId) {
            alert('Please select a customer to update.');
            return;
        }

        // Collect the updated input values
        var updatedName = $('#cusName').val();
        var updatedAddress = $('#cusAddress').val();
        var updatedContact = $('#cusContact').val();

        // Create the updated customer object
        let updatedCustomer = {
            name: updatedName,
            address: updatedAddress,
            contact: updatedContact
        };

        // Convert the updated customer object to JSON format
        let jsonUpdatedCustomer = JSON.stringify(updatedCustomer);

        // Send the updated data with AJAX
        $.ajax({
            url: `http://localhost:8080/api/v1/customer/${customerId}`, // Updated URL
            type: "PUT",
            data: jsonUpdatedCustomer,
            contentType: "application/json",
            success: (res) => {
                alert('Customer updated successfully');
                console.log("Response from PUT request:", res);

                // Clear the input fields
                $('#cusId').val('');
                $('#cusName').val('');
                $('#cusAddress').val('');
                $('#cusContact').val('');

                // Re-populate the dropdown and table
                populateCustomerDropdown();
                populateCustomerTable();
            },
            error: (res) => {
                alert('Failed to update customer');
                console.error("Error updating customer:", res.status, res.statusText);
            }
        });
    });

    // Function to populate the customer dropdown
    function populateCustomerDropdown() {
        $.ajax({
            url: "http://localhost:8080/api/v1/customer", // Updated URL
            type: "GET",
            dataType: "json",
            success: (data) => {
                console.log("Data retrieved from GET request:", data);

                // Clear existing dropdown items
                $('#customerID').siblings('.dropdown-menu').empty();

                // Populate dropdown with customer names
                data.forEach(customer => {
                    $('#customerID').siblings('.dropdown-menu').append(
                        `<li><a class="dropdown-item" href="#" data-id="${customer.id}">${customer.name}</a></li>`
                    );
                });

                // Optional: add click event handler to dropdown items
                $('.dropdown-menu .dropdown-item').on('click', function() {
                    const customerId = $(this).data('id');
                    const customerName = $(this).text();
                    $('#customerID').text(customerName);
                    $('#cusId').val(customerId);

                    // Fetch and populate customer details
                    fetchAndPopulateCustomerDetails(data, customerId);
                });
            },
            error: (res) => {
                console.error("Error retrieving customer data:", res.status, res.statusText);
            }
        });
    }

    // Function to filter and display customer details
    function fetchAndPopulateCustomerDetails(customers, customerId) {
        const customer = customers.find(c => c.id == customerId);

        if (customer) {
            console.log("Customer details retrieved:", customer);

            // Populate the input fields with customer details
            $('#cusId').val(customer.id);
            $('#cusName').val(customer.name);
            $('#cusAddress').val(customer.address);
            $('#cusContact').val(customer.contact);
        } else {
            console.error("Customer not found in the retrieved data.");
        }
    }

    // Function to populate the customer table
    function populateCustomerTable() {
        $.ajax({
            url: "http://localhost:8080/api/v1/customer", // Updated URL
            type: "GET",
            dataType: "json",
            success: (data) => {
                console.log("Data retrieved from GET request:", data);

                // Clear existing table rows
                $('#customerTable tbody').empty();

                // Populate table with customer data
                data.forEach(customer => {
                    $('#customerTable tbody').append(
                        `<tr>
                            <th scope="row">${customer.id}</th>
                            <td>${customer.name}</td>
                            <td>${customer.address}</td>
                            <td>${customer.contact}</td>
                        </tr>`
                    );
                });
            },
            error: (res) => {
                console.error("Error retrieving customer data:", res.status, res.statusText);
            }
        });
    }
});
