"use strict";
$(function () {
  const dtUserTable = $(".user-list-table");
  const statusDropdown = $("#StatusDropdown");

  if (dtUserTable.length) {
    let startDate = "";
    let endDate = "";

    if (typeof flatpickr !== "undefined") {
      flatpickr("#user-range2", {
        mode: "range",
        dateFormat: "Y-m-d",
        onClose: function (selectedDates) {
          if (selectedDates.length === 2) {
            startDate = selectedDates[0].toISOString().split("T")[0];
            endDate = selectedDates[1].toISOString().split("T")[0];
          }
        },
      });
    }

    const table = dtUserTable
      .on("preXhr.dt", function () {
        $("#loader").show();
      })
      .on("draw.dt", function () {
        $("#loader").hide();
      })
      .DataTable({
        processing: true,
        serverSide: true,
        ajax: {
          url: `${window.location.protocol}//${window.location.host}/admin/getall`,
          method: "POST",
          data: function (d) {
            const selectedValue = statusDropdown.val();
            d.status = "";
            d.subscribed = "";

            if (
              selectedValue === "active" ||
              selectedValue === "inactive" ||
              selectedValue === "banned"
            ) {
              d.status = selectedValue;
            } else if (selectedValue === "true" || selectedValue === "false") {
              d.subscribed = selectedValue;
            }

            d.startDate = startDate;
            d.endDate = endDate;

            return d;
          },
          dataFilter: function (data) {
            let json = JSON.parse(data);
            json.recordsTotal = json.data.recordsTotal;
            json.recordsFiltered = json.data.recordsFiltered;
            json.data = json.data.data;
            json.totalDocs = json.totalDocs;
            return JSON.stringify(json);
          },
        },
        columns: [
          { data: "name", title: "Name" },
          { data: "email", title: "Email" },
          { data: "createdAt", title: "Registered On" },
          { data: "contactNumber", title: "Contact No" },
          { data: "subscribed", title: "Subscribed" },
          { data: "status", title: "Status" },
          { data: "_id", title: "Actions" },
        ],
        dom:
          '<"d-flex justify-content-between align-items-center header-actions mx-2 mt-75 row"' +
          '<"col-sm-12 col-md-6"l>' +
          '<"col-sm-12 col-md-6 d-flex justify-content-end align-items-center header-search-filter"fB>' +
          ">t" +
          '<"d-flex justify-content-between mx-2 row mb-1"' +
          '<"col-sm-12 col-md-6"i>' +
          '<"col-sm-12 col-md-6"p>' +
          ">",
        buttons: [
          {
            text: "Filter(s)",
            className: "add-filter btn btn-primary",
            attr: {
              "data-bs-toggle": "modal",
              "data-bs-target": "#filters-modal",
            },
            init: function (api, node) {
              $(node).removeClass("btn-secondary");
            },
          },
        ],
        language: {
          sLengthMenu: "Show _MENU_ entries",
          search: "Search",
          searchPlaceholder: "Search users...",
          processing: "Loading...",
          zeroRecords: "No users found!",
        },
        columnDefs: [
          {
            targets: 2,
            render: function (data) {
              if (!data) return "N/A";
              const dateValue = moment(data, moment.ISO_8601, true);
              return dateValue.isValid()
                ? dateValue.format("MMM D, YYYY")
                : "N/A";
            },
          },
          {
            targets: 4,
            render: function (data, type, row, meta) {
              const badgeClass = data
                ? "badge-light-primary"
                : "badge-light-warning";
              const text = data ? "Subscribed" : "Unsubscribed";
              return `
                <span class="badge ${badgeClass} text-capitalize subscription-badge"
                style="cursor:pointer;"
                data-id="${row._id}"
                data-subscribed="${data}">
                ${text}
                </span>`;
              },
          },
          {
            targets: 5,
            render: function (data) {
              const colorMap = {
                active: "badge-light-success",
                inactive: "badge-light-secondary",
                banned: "badge-light-danger",
              };
              const badgeClass = colorMap[data] || "badge-light-secondary";
              return `<span class="badge ${badgeClass} text-capitalize status-badge" style="cursor:pointer;">${
                data || "unknown"
              }</span>`;
            },
          },
          {
            targets: 6,
            render: function (data) {
              return `
                <button class="btn btn-sm btn-info view-user" data-id="${data}">
                  <i class="bi bi-eye"></i> Details
                </button>
                <button class="btn btn-sm btn-primary edit-user" data-id="${data}">
                  <i class="bi bi-pencil"></i> Edit
                </button>
                <button class="btn btn-sm btn-danger delete-user" data-id="${data}">
                  <i class="bi bi-trash"></i>
                </button>`;
            },
          },
        ],
        order: [[4, "desc"]],
      });

    //  Reload on dropdown change
    statusDropdown.on("change", () => table.ajax.reload());

    $(document).on("click", ".view-user", function () {
      const userId = $(this).data("id");
      window.location.href = `/admin/userdetails/${userId}`;
    });
    // Status change modal
    $(document).on("click", ".status-badge", function () {
      const row = $(this).closest("tr");
      const userId = row.find(".btn-primary").data("id");
      const currentStatus = $(this).text().trim();
      $("#selectedUserId").val(userId);
      $("#statusSelect").val(currentStatus);
      $("#statusModal").modal("show");
    });

    $("#confirmStatusChange").on("click", function () {
      const userId = $("#selectedUserId").val();
      const newStatus = $("#statusSelect").val();
      Swal.fire({
        title: "Confirm Status Change?",
        text: `Change user status to "${newStatus}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, change it!",
      }).then((result) => {
        if (result.isConfirmed) {
          $.ajax({
            url: `/admin/changestatus/${userId}`,
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify({ status: newStatus }),
            success: () => {
              $("#statusModal").modal("hide");
              Swal.fire("Updated!", "Status changed successfully.", "success");
              table.ajax.reload(null, false);
            },
            error: () => {
              Swal.fire("Error!", "Failed to update status.", "error");
            },
          });
        }
      });
    });

    //Subscription change modal
    $(document).on("click", ".subscription-badge", function () {
      const row = $(this).closest("tr");
      const userId = row.find(".btn-primary").data("id");
      const currentSub = $(this).data("subscribed");

      $("#subscriptionUserId").val(userId);
      $("#subscriptionSelect").val(currentSub.toString());
      $("#subscriptionModal").modal("show");
    });

    $("#confirmSubscriptionChange").on("click", function () {
      const userId = $("#subscriptionUserId").val();
      const newSub = $("#subscriptionSelect").val();
      const isSubscribed = newSub === "true";
      const value = isSubscribed ? "Subscribed" : "Unsubscribed";

      Swal.fire({
        title: "Confirm Subscription Change?",
        text: `Change to "${value}"?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, update it!",
      }).then((result) => {
        if (result.isConfirmed) {
          $.ajax({
            url: `/admin/updatesubscription/${userId}`,
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify({ subscribed: isSubscribed }),
            success: () => {
              $("#subscriptionModal").modal("hide");
              Swal.fire("Success!", "Subscription updated.", "success");
              table.ajax.reload(null, false);
            },
            error: () => {
              Swal.fire("Error!", "Failed to update subscription.", "error");
            },
          });
        }
      });
    });

    table.on("preXhr.dt", function (e, settings, data) {
      data.startDate = startDate;
      data.endDate = endDate;
    });

    $("#filter_user_btn").on("click", function (e) {
      e.preventDefault();
      table.ajax.reload();
    });

    //Filter modal button
    $(document).on("click", ".add-filter", function () {
      $("#filters-modal").modal("show");
    });

    //Filter reset button
    $("#filter_user_reset_btn").on("click", function () {
      startDate = "";
      endDate = "";
      $("#user-range2").val("");
      table.ajax.reload();
    });

    //Edit user
    $(document).on("click", ".edit-user", async function () {
      const userId = $(this).data("id");

      try {
        $("#loader").show();

        const response = await fetch(`/admin/jsondetails/${userId}`);
        const result = await response.json();

        if (result.success && result.data) {
          const user = result.data;
          $("#editUserId").val(user._id);
          $("#FirstName").val(user.firstName || "");
          $("#LastName").val(user.lastName || "");
          $("#editEmail").val(user.email || "");
          $("#editContactNumber").val(user.contactNumber || "");
          $("#editStatus").val(user.status || "inactive");
          $("#editVerified").val(user.is_verified ? "true" : "false");
          $("#editSubscribed").val(user.subscribed ? "true" : "false");

          const modal = new bootstrap.Modal(
            document.getElementById("editUserModal")
          );
          modal.show();
        } else {
          Swal.fire("Error", "User details not found.", "error");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        Swal.fire(
          "Error",
          "Something went wrong while fetching user data.",
          "error"
        );
      } finally {
        $("#loader").hide();
      }
    });
    
    //Update user changes
    $(document).on("click", "#saveUserChanges", function (e) {
      e.preventDefault();

      const userId = $("#editUserId").val();
      const updatedUser = {
        firstName: $("#FirstName").val(),
        lastName: $("#LastName").val(),
        contactNumber: $("#editContactNumber").val(),
        status: $("#editStatus").val(),
        is_verified: $("#editVerified").val() === "true",
        subscribed: $("#editSubscribed").val() === "true",
      };

      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to update this user's details?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, update it!",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          $.ajax({
            url: `/admin/updateuser/${userId}`,
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify(updatedUser),
            success: function () {
              Swal.fire("Updated!", "User updated successfully.", "success");
              $("#editUserModal").modal("hide");
              table.ajax.reload(null, false);
            },
            error: function () {
              Swal.fire("Error!", "Failed to update user.", "error");
            },
          });
        }
      });
    });

    //Delete user
    $(document).on("click", ".delete-user", function () {
      const userId = $(this).data("id");
      Swal.fire({
        title: "Are you sure?",
        text: "You will not be able to recover this user!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          $.ajax({
            url: `/admin/delete/${userId}`,
            method: "DELETE",
            success: function () {
              Swal.fire("Deleted!", "User has been deleted.", "success");
              table.ajax.reload(null, false);
            },
            error: function () {
              Swal.fire("Error!", "Failed to delete user.", "error");
            },
          });
        }
      });
    });
  }
});
