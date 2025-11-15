"use strict";
$(function () {
  const dtBlogTable = $(".subs-list-table");
  const statusDropdown = $("#StatusDropdown");

  if (dtBlogTable.length) {
    let startDate = "";
    let endDate = "";

    if (typeof flatpickr !== "undefined") {
      flatpickr("#blog-range2", {
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

    const table = dtBlogTable
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
          url: `${window.location.protocol}//${window.location.host}/admin/subscription/getall`,
          method: "POST",
          data: function (d) {
            const selectedValue = statusDropdown.val();
            d.status = "";

            if (selectedValue === "active" || selectedValue === "inactive") {
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
          { data: "charges", title:"Charges(₹)"},
          { data: "createdAt", title: "Created On" },
          { data: "duration", title:"Duration(In Day's)"},
          { data: "addedby", title: "Added By" },
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
          {
            text: "Add",
            className: "btn btn-primary",
            attr: {
              "data-toggle": "modal",
              "data-target": "#addSubscriptionModal",
            },
          },
        ],
        language: {
          sLengthMenu: "Show _MENU_ entries",
          search: "Search",
          searchPlaceholder: "Search Plan by name | Price...",
          processing: "Loading...",
          zeroRecords: "No Subscription Record found!",
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
            targets: 5,
            render: function (data) {
              const colorMap = {
                active: "badge-light-success",
                inactive: "badge-light-danger",
              };
              const badgeClass = colorMap[data] || "badge-light-danger";
              return `<span class="badge ${badgeClass} text-capitalize status-badge" style="cursor:pointer;">${
                data || "unknown"
              }</span>`;
            },
          },
          {
            targets: 6,
            render: function (data) {
              return `
                <button class="btn btn-sm btn-info view-subs" data-id="${data}">
                  <i class="bi bi-eye"></i> Details
                </button>
                <button class="btn btn-sm btn-primary edit-subs" data-id="${data}">
                  <i class="bi bi-pencil"></i> Edit
                </button>
                <button class="btn btn-sm btn-danger delete-subs" data-id="${data}">
                  <i class="bi bi-trash"></i>
                </button>`;
            },
          },
        ],
        order: [[2, "desc"]],
      });

    //  Reload on dropdown change
    statusDropdown.on("change", () => table.ajax.reload());

    $(document).on("click", ".view-subs", function () {
      const subsId = $(this).data("id");
      
      window.location.href = `/admin/subscription/getdetails/${subsId}`;
    });

    // Status change modal
    $(document).on("click", ".status-badge", function () {
      const row = $(this).closest("tr");
      const faqId = row.find(".btn-primary").data("id");
      
      const currentStatus = $(this).text().trim();
      $("#selectedSubsId").val(faqId);
      $("#statusSelect").val(currentStatus);
      $("#statusModal").modal("show");
    });
    
    //staus update by id 
    $("#confirmStatusChange").on("click", function () {
      const subsId = $("#selectedSubsId").val();
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
            url: `/admin/subscription/changestatus/${subsId}`,
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

    // date wise filter
    table.on("preXhr.dt", function (e, settings, data) {
      data.startDate = startDate;
      data.endDate = endDate;
    });

    //Filter modal button
    $(document).on("click", ".add-filter", function () {
      $("#filters-modal").modal("show");
    });

    //Filter reset button
    $("#filter_blog_reset_btn").on("click", function () {
      startDate = "";
      endDate = "";
      $("#blog-range2").val("");
      table.ajax.reload();
    });

    //Filter apply button
    $("#filter_blog_btn").on("click", function (e) {
      e.preventDefault();
      table.ajax.reload();
    });

    //Add Subscription plan modal button
    $(document).on("click", ".addSubsModalBtn", function () {
      $("#addSubscriptionModal").modal("show");
    });

    //Add Subscription plan
    $(document).on("submit", "#addSubscriptionForm", function (e) {
      e.preventDefault();
      $.ajax({
        url: "/admin/subscription/create",
        type: "POST",
        data:{
            name: $("#name").val(),
            charges: $("#charges").val(),
            inclusions:$('#inclusions').val(),
            details:$('#details').val(),
            duration:$('#duration').val(),

        },
        success: function (response) {
          $("#addSubscriptionModal").modal("hide");
          $("#addSubscriptionForm")[0].reset();
          Swal.fire("Created!", "Subscription created successfully.", "success");
          table.ajax.reload(null, false);
        },
        error: function () {
          Swal.fire("Error!", "Failed to add Subscription", "error");
        },
      });
    });

    //Edit subscription plan details
    $(document).on("click", ".edit-subs", async function () {
      const subsId = $(this).data("id");
      try {
        $("#loader").show();

        const response = await fetch(`/admin/subscription/details/${subsId}`);
        const result = await response.json();

        if (result.status && result.data) {
          const subs = result.data;

          $("#editSubsId").val(subs._id);
          $("#subsname").val(subs.name || "");
          $("#subscharges").val(subs.charges || "");
          $("#subsinclusions").val(subs.inclusions || "");
          $("#subsdetails").val(subs.details);
          $("#subsduration").val(subs.duration);
          $("#editStatus").val(subs.status);

          const modal = new bootstrap.Modal(
            document.getElementById("editSubsModal")
          );
          modal.show();
        } else {
          Swal.fire("Error", "Blog details not found.", "error");
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

    // Update subscription plan changes
    $(document).on("click", "#saveSubsChanges", function (e) {
        e.preventDefault();
        const subsId = $("#editSubsId").val();

        const updatedSubs = {
        name: $("#subsname").val(),
        charges: $("#subscharges").val(),
        inclusions: $("#subsinclusions").val(),
        details: $("#subsdetails").val(),
        duration: $("#subsduration").val(),
        status: $("#editStatus").val(),

        };

        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to update this Subscription Plan?",
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: "Cancel",
            confirmButtonText: "Yes, update it!",
        }).then((result) => {
            if (result.isConfirmed) {
            $.ajax({
                url: `/admin/subscription/update/${subsId}`,
                type: "PUT",
                contentType: "application/json",
                data: JSON.stringify(updatedSubs),
                success: function (response) {
                Swal.fire("Updated!", response.message, "success");
                $("#editSubsModal").modal("hide");
                table.ajax.reload(null, false);
                },
                error: function (xhr) {
                console.error("Error response:", xhr);
                Swal.fire(
                    "Error!",
                    xhr.responseJSON?.message || "Failed to update Subscription",
                    "error"
                );
                },
            });
            }
        });
    });
 
    //Delete subscription plan
    $(document).on("click", ".delete-subs", function () {  
      const supportId = $(this).data("id");
      Swal.fire({
        title: "Are you sure?",
        text: "You will not be able to recover this Subscription!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          $.ajax({
            url: `/admin/subscription/delete/${supportId}`,
            method: "DELETE",
            success: function () {
              Swal.fire("Deleted!", "Subscription has been deleted.", "success");
              table.ajax.reload(null, false);
            },
            error: function () {
              Swal.fire("Error!", "Failed to delete Subscription.", "error");
            },
          });
        }
      });
    });
  }
});
