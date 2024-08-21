// Function to populate the customer dropdown
function populateCustomerDropdown() {
    $.ajax({
        url: "http://localhost:8080/customer", // URL to get all customers
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

                // Fetch and populate customer details from the list
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
    // Find the customer by ID
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
        url: "http://localhost:8080/customer", // URL to get all customers
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

// Call the function when the document is ready
$(document).ready(function() {
    populateCustomerDropdown(); // Populate the dropdown when the page loads
    populateCustomerTable();

    $('#cusUpdate').on('click', (event) => {
        event.preventDefault(); // Prevent default form submission
        updateCustomer(); // Call the function to update customer
    });

    $('#cusSave').on('click', (event) => {
        event.preventDefault(); // Prevent default form submission
        console.log("saveClicked");

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

        console.log("Customer object:", customer);

        // Convert the customer object to JSON format
        let jsonCustomer = JSON.stringify(customer);
        console.log("JSON customer:", jsonCustomer);

        // Send the data with AJAX
        $.ajax({
            url: "http://localhost:8080/customer", // Adjust the URL if necessary
            type: "POST",
            data: jsonCustomer,
            contentType: "application/json",
            success: (res) => {
                alert('Customer saved successfully');
                console.log("Response from POST request:", res);

                // Clear the input fields after successful save
                $('#cusName').val('');
                $('#cusAddress').val('');
                $('#cusContact').val('');

                // Re-populate the dropdown and table to include the new customer
                populateCustomerDropdown();
                populateCustomerTable();
            },
            error: (res) => {
                alert('Failed to save customer');
                console.error("Error saving customer:", res.status, res.statusText);
            }
        });
    });

    // Function to handle the delete button click
    $('#cusDelete').on('click', (event) => {
        event.preventDefault(); // Prevent default form submission

        // Get the selected customer ID from the input field
        var customerID = $('#cusId').val();

        if (!customerID) {
            alert('Please select a customer to delete.');
            return;
        }

        // Confirm the deletion
        if (confirm('Are you sure you want to delete this customer?')) {
            $.ajax({
                url: `http://localhost:8080/customer?id=${customerID}`, // URL to send DELETE request
                type: "DELETE",
                success: (res) => {
                    alert('Customer deleted successfully');
                    console.log("Response from DELETE request:", res);

                    // Clear the input fields
                    $('#cusId').val('');
                    $('#cusName').val('');
                    $('#cusAddress').val('');
                    $('#cusContact').val('');

                    // Re-populate the dropdown and table to reflect the deletion
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
});
