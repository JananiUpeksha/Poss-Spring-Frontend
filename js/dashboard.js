$(document).ready(function() {
    // Function to populate the customer table on the dashboard
    function populateCustomerTableOnDashboard() {
        $.ajax({
            url: "http://localhost:8080/customer", // URL to get all customers
            type: "GET",
            dataType: "json",
            success: (data) => {
                console.log("Data retrieved from GET request:", data);

                // Clear existing table rows
                $('#dashTable tbody').empty();

                // Populate table with customer data
                data.forEach(customer => {
                    $('#dashTable tbody').append(
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

    // Call the function to populate the table on page load
    populateCustomerTableOnDashboard();
});
