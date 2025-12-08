"use strict";
$(function () {
  const dtBlogTable = $(".support-list-table");
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
          url: `${window.location.protocol}//${window.location.host}/admin/support/getall`,
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
          { data: "email", title: "Email" },
          { data: "phone", title: "Phone" },
          { data: "createdAt", title: "Created On" },
          { data: "status", title: "Status" },
          { data: "progressstatus", title: "Progress Status"},
          { data: "priority", title: "Priority"}, 
          { data: "resolvedby", title: "Resolved By" },   
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
          searchPlaceholder: "Search by email | Phone...",
          processing: "Loading...",
          zeroRecords: "No Queries Record found!",
        },
        columnDefs: [
          {
            targets: 3,
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
            targets: 5,
            render: function (data) {
              const colorMap = {
                pending: "badge-light-warning",
                processing: "badge-light-success",
                resolved:"badge-light-danger",
              };
              const badgeClass = colorMap[data] || "badge-light-danger";
              return `<span class="badge ${badgeClass} text-capitalize progress-status-badge" style="cursor:pointer;">${
                data || "unknown"
              }</span>`;
            },
          },
          {
            targets: 6,
            render: function (data) {
              const colorMap = {
                low: "badge-light-warning",
                medium: "badge-light-success",
                high:"badge-light-danger",
              };
              const badgeClass = colorMap[data] || "badge-light-danger";
              return `<span class="badge ${badgeClass} text-capitalize priority-status-badge" style="cursor:pointer;">${
                data || "unknown"
              }</span>`;
            },
          },
          {
            targets: 8,
            render: function (data) {
              return `
                <button class="btn btn-sm btn-info view-support" data-id="${data}">
                  <i class="bi bi-eye"></i> Details
                </button>`;
                
            },
          },
        ],
        order: [[7, "desc"]],
      });

    //  Reload on dropdown change
    statusDropdown.on("change", () => table.ajax.reload());

    // get support details 
    $(document).on("click", ".view-support", function () {
      const supportId = $(this).data("id");
      window.location.href = `/admin/support/details/${supportId}`;
    });

    // Status change modal
    $(document).on("click", ".status-badge", function () {
      const row = $(this).closest("tr");
      const supportId = row.find(".view-support").data("id"); 
      const currentStatus = $(this).text().trim();
      $("#selectedSupportId").val(supportId);
      $("#statusSelect").val(currentStatus);
      $("#statusModal").modal("show");
    });
    //staus update by id 
    $("#confirmStatusChange").on("click", function () {
      const supportId = $("#selectedSupportId").val();
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
            url: `/admin/support/changestatus/${supportId}`,
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


    //progress Status change modal
    $(document).on("click", ".progress-status-badge", function () {
      const row = $(this).closest("tr");
      const supportId = row.find(".view-support").data("id");
      const currentStatus = $(this).text().trim();
      $("#selectedSupportId").val(supportId);
      $("#progressstatusSelect").val(currentStatus);
      $("#ProgressStatusModal").modal("show");
    });

    //progress status update by id 
    $("#confirmProgressChange").on("click", function () {
      const supportId = $("#selectedSupportId").val();
      const newStatus = $("#progressstatusSelect").val();
      Swal.fire({
        title: "Confirm Status Change?",
        text: `Change user status to "${newStatus}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, change it!",
      }).then((result) => {
        if (result.isConfirmed) {
          $.ajax({
            url: `/admin/support/changeprogress/${supportId}`,
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify({ progressstatus: newStatus }),
            success: () => {
              $("#ProgressStatusModal").modal("hide");
              Swal.fire("Updated!", "Prgoress Status changed successfully.", "success");
              table.ajax.reload(null, false);
            },
            error: () => {
              Swal.fire("Error!", "Failed to update Prgoress status.", "error");
            },
          });
        }
      });
    });

    //Priority Status change modal
    $(document).on("click", ".priority-status-badge", function () {
      const row = $(this).closest("tr");
      const supportId = row.find(".view-support").data("id"); 
      const currentStatus = $(this).text().trim();
      $("#selectedSupportId").val(supportId);
      $("#prioritystatusSelect").val(currentStatus);
      $("#PriorityStatusModal").modal("show");
    });
    
    //Priority staus update by id 
    $("#confirmPriorityChange").on("click", function () {
      const supportId = $("#selectedSupportId").val();
      const newStatus = $("#prioritystatusSelect").val();
      Swal.fire({
        title: "Confirm Status Change?",
        text: `Change user status to "${newStatus}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, change it!",
      }).then((result) => {
        if (result.isConfirmed) {
          $.ajax({
            url: `/admin/support/changepriority/${supportId}`,
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify({ priority: newStatus }),
            success: () => {
              $("#PriorityStatusModal").modal("hide");
              Swal.fire("Updated!", "Priority Status changed successfully.", "success");
              table.ajax.reload(null, false);
            },
            error: () => {
              Swal.fire("Error!", "Failed to update Priority status.", "error");
            },
          });
        }
      });
    });

    table.on("preXhr.dt", function (e, settings, data) {
      data.startDate = startDate;
      data.endDate = endDate;
    });

    //Filter by date modal button
    $(document).on("click", ".add-filter", function () {
      $("#filters-modal").modal("show");
    });

    //Filter date reset button
    $("#filter_blog_reset_btn").on("click", function () {
      startDate = "";
      endDate = "";
      $("#blog-range2").val("");
      table.ajax.reload();
    });

    //Filter date apply button
    $("#filter_blog_btn").on("click", function (e) {
      e.preventDefault();
      table.ajax.reload();
    });

    

  }
});
