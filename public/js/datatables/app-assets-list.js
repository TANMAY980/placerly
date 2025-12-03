"use strict";
$(function () {
  const dtBlogTable = $(".asset-list-table");
  const statusDropdown = $("#StatusDropdown");

  if (dtBlogTable.length) {
    let startDate = "";
    let endDate = "";

    if (typeof flatpickr !== "undefined") {
      flatpickr("#asset-range2", {
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
          url: `${window.location.protocol}//${window.location.host}/admin/asset/getall`,
          method: "POST",
          data: function (d) {
            const selectedValue = statusDropdown.val();
            d.status = "";
            d.accounttype = "";

            if (selectedValue === "active" || selectedValue === "inactive") {
              d.status = selectedValue;
            }
            if (selectedValue === "cash" || selectedValue === "stock") {
            d.accounttype = selectedValue;
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
          { data: "accounttype", title:"Account Type"},
          { data: "createdAt", title: "Created On" },
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
              "data-target": "#addAssetModal",
            },
          },
        ],
        language: {
          sLengthMenu: "Show _MENU_ entries",
          search: "Search",
          searchPlaceholder: "Search Asset by name ",
          processing: "Loading...",
          zeroRecords: "No Assets Record found!",
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
              return `
                <button class="btn btn-sm btn-info view-asset" data-id="${data}">
                  <i class="bi bi-eye"></i> Details
                </button>
                <button class="btn btn-sm btn-primary edit-asset" data-id="${data}">
                  <i class="bi bi-pencil"></i> Edit
                </button>
                <button class="btn btn-sm btn-danger delete-asset" data-id="${data}">
                  <i class="bi bi-trash"></i>
                </button>`;
            },
          },
        ],
        order: [[3, "desc"]],
      });

    //  Reload on dropdown change
    statusDropdown.on("change", () => table.ajax.reload());

    $(document).on("click", ".view-asset", function () {
      const assetId = $(this).data("id");
      
      window.location.href = `/admin/asset/getdetails/${assetId}`;
    });

    // Status change modal
    $(document).on("click", ".status-badge", function () {
      const row = $(this).closest("tr");
      const assetId = row.find(".btn-primary").data("id");
      
      const currentStatus = $(this).text().trim();
      $("#selectedAssetId").val(assetId);
      $("#statusSelect").val(currentStatus);
      $("#statusModal").modal("show");
    });
    
    //staus update by id 
    $("#confirmStatusChange").on("click", function () {
      const subsId = $("#selectedAssetId").val();
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
            url: `/admin/asset/changestatus/${subsId}`,
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
    $("#filter_asset_reset_btn").on("click", function () {
      startDate = "";
      endDate = "";
      $("#asset-range2").val("");
      table.ajax.reload();
    });

    //Filter apply button
    $("#filter_asset_btn").on("click", function (e) {
      e.preventDefault();
      table.ajax.reload();
    });

    //Add Asset plan modal button
    $(document).on("click", ".addAssetModalBtn", function () {
      $("#addAssetModal").modal("show");
    });

    //Add Asset plan
    $(document).on("submit", "#addAssetForm", function (e) {
      e.preventDefault();
      $.ajax({
        url: "/admin/asset/create",
        type: "POST",
        data:{
            name: $("#name").val(),
            accounttype: $("#accounttype").val(),

        },
        success: function (response) {
          $("#addAssetModal").modal("hide");
          $("#addAssetForm")[0].reset();
          Swal.fire("Created!", "Asset created successfully.", "success");
          table.ajax.reload(null, false);
        },
        error: function () {
          Swal.fire("Error!", "Failed to add Asset", "error");
        },
      });
    });

    //Edit Asset  details
    $(document).on("click", ".edit-asset", async function () {
      const assetId = $(this).data("id");
      try {
        $("#loader").show();

        const response = await fetch(`/admin/asset/details/${assetId}`);
        const result = await response.json();    
        if (result.status && result.data) {
          const asset = result.data;
            
          $("#editAssetId").val(asset._id);
          $("#editassetname").val(asset.name || "");
          $("#editAccountype").val(asset.accounttype || "");
          $("#editStatus").val(asset.status);

          const modal = new bootstrap.Modal(
            document.getElementById("editAssetModal")
          );
          modal.show();
        } else {
          Swal.fire("Error", "Asset details not found.", "error");
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

    // Update Asset plan changes
    $(document).on("click", "#saveAssetChanges", function (e) {
        e.preventDefault();
        const assetId = $("#editAssetId").val();

        const updatedSubs = {
        name: $("#editassetname").val(),
        accounttype:$("#editAccountype").val(),
        status: $("#editStatus").val(),

        };

        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to update this Asset Details?",
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: "Cancel",
            confirmButtonText: "Yes, update it!",
        }).then((result) => {
            if (result.isConfirmed) {
            $.ajax({
                url: `/admin/asset/update/${assetId}`,
                type: "PUT",
                contentType: "application/json",
                data: JSON.stringify(updatedSubs),
                success: function (response) {
                Swal.fire("Updated!", response.message, "success");
                $("#editAssetModal").modal("hide");
                table.ajax.reload(null, false);
                },
                error: function (xhr) {
                console.error("Error response:", xhr);
                Swal.fire(
                    "Error!",
                    xhr.responseJSON?.message || "Failed to update Asset",
                    "error"
                );
                },
            });
            }
        });
    });
 
    //Delete Asset plan
    $(document).on("click", ".delete-asset", function () {  
      const assetId = $(this).data("id");
      Swal.fire({
        title: "Are you sure?",
        text: "You will not be able to recover this Subscription!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          $.ajax({
            url: `/admin/asset/delete/${assetId}`,
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
