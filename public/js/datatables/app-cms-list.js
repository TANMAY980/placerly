"use strict";
$(function () {
  const dtBlogTable = $(".cms-list-table");
  const statusDropdown = $("#StatusDropdown");

  if (dtBlogTable.length) {
    let startDate = "";
    let endDate = "";

    if (typeof flatpickr !== "undefined") {
      flatpickr("#cms-range2", {
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
          url: `${window.location.protocol}//${window.location.host}/admin/cms/getall`,
          method: "POST",
          data: function (d) {
            const selectedValue = statusDropdown.val();
            d.status = "";

            if (selectedValue === "active" || selectedValue === "inactive") {
              d.status = selectedValue;
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
          { data: "title", title: "Title" },
          { data: "content", title: "Content",
            render: function(data, type, row) {
            if (data.length > 50) {
              return data.substring(0, 50) + '...';
            }
            return data;
          }},
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
              "data-target": "#addCmsModal",
            },
          },
        ],
        language: {
          sLengthMenu: "Show _MENU_ entries",
          search: "Search",
          searchPlaceholder: "Search Cms...",
          processing: "Loading...",
          zeroRecords: "No Cms Record found!",
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
                <button class="btn btn-sm btn-info view-cms" data-id="${data}">
                  <i class="bi bi-eye"></i> Details
                </button>
                <button class="btn btn-sm btn-primary edit-cms" data-id="${data}">
                  <i class="bi bi-pencil"></i> Edit
                </button>
                <button class="btn btn-sm btn-danger delete-cms" data-id="${data}">
                  <i class="bi bi-trash"></i>
                </button>`;
            },
          },
        ],
        order: [[2, "desc"]],
      });

    //  Reload on dropdown change
    statusDropdown.on("change", () => table.ajax.reload());

    //details modal
    $(document).on("click", ".view-cms", function () {
      const cmsId = $(this).data("id")
      window.location.href = `/admin/cms/details/${cmsId}`;
    });
    // Status change modal
    $(document).on("click", ".status-badge", function () {
      const row = $(this).closest("tr");
      const cmsId = row.find(".btn-primary").data("id");
      const currentStatus = $(this).text().trim();
      $("#selectedCmsId").val(cmsId);
      $("#statusSelect").val(currentStatus);
      $("#statusModal").modal("show");
    });

    // change status by id
    $("#confirmStatusChange").on("click", function () {
      const cmsId = $("#selectedCmsId").val();
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
            url: `/admin/cms/changestatus/${cmsId}`,
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

    // filter
    table.on("preXhr.dt", function (e, settings, data) {
      data.startDate = startDate;
      data.endDate = endDate;
    });

    //Filter modal button
    $(document).on("click", ".add-filter", function () {
      $("#filters-modal").modal("show");
    });

    //Filter reset button
    $("#filter_cms_reset_btn").on("click", function () {
      startDate = "";
      endDate = "";
      $("#cms-range2").val("");
      table.ajax.reload();
    });

    //Filter apply button
    $("#filter_cms_btn").on("click", function (e) {
      e.preventDefault();
      table.ajax.reload();
    });

    //Add Cms modal button
    $(document).on("click", ".addCmsModalBtn", function () {
      $("#addCmsModal").modal("show");
    });

    //Add Cms
    $(document).on("submit", "#addCmsForm", function (e) {
      e.preventDefault();

      const formData = new FormData();

      const title = $("#title").val();
      const content = $("#content").val();
      const files = $("#bannerImage")[0].files;

      formData.append("title", title);
      formData.append("content", content);
      for (let i = 0; i < files.length; i++) {
        formData.append("bannerImage", files[i]);
      }

      $.ajax({
        url: "/admin/cms/create",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
          $("#addCmsModal").modal("hide");
          $("#addCmsForm")[0].reset();
          Swal.fire("Created!", "Cms created successfully.", "success");
          table.ajax.reload(null, false);
        },
        error: function () {
          Swal.fire("Error!", "Failed to add cms", "error");
        },
      });
    });

    //Edit blog
    $(document).on("click", ".edit-cms", async function () {
      const cmsId = $(this).data("id");
      try {
        $("#loader").show();

        const response = await fetch(`/admin/cms/getdetails/${cmsId}`);
        const result = await response.json();

        if (result.status && result.data) {
          const cms = result.data;

          $("#editCmsId").val(cms._id);
          $("#CmsTitle").val(cms.title || "");
          $("#CmsContent").val(cms.content || "");
          $("#editStatus").val(cms.status || "inactive");

          const modal = new bootstrap.Modal(
            document.getElementById("editCmsModal")
          );
          modal.show();
        } else {
          Swal.fire("Error", "Cms details not found.", "error");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        Swal.fire(
          "Error",
          "Something went wrong while fetching cms data.",
          "error"
        );
      } finally {
        $("#loader").hide();
      }
    });

    // Update blog changes
    $(document).on("click", "#saveCmsChanges", function (e) {
      e.preventDefault();

      const cmsId = $("#editCmsId").val();
      const formData = new FormData();

      formData.append("title", $("#CmsTitle").val());
      formData.append("content", $("#CmsContent").val());
      formData.append("status", $("#editStatus").val());

      const files = $("#editbannerImage")[0].files;

      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          formData.append("bannerImage", files[i]);
        }
      }

      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to update this blog?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, update it!",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          $.ajax({
            url: `/admin/cms/update/${cmsId}`,
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
              Swal.fire("Updated!", response.message, "success");
              $("#editCmsModal").modal("hide");
              table.ajax.reload(null, false);
            },
            error: function (xhr) {
              Swal.fire(
                "Error!",
                xhr.responseJSON?.message || "Failed to update cms",
                "error"
              );
            },
          });
        }
      });
    });

    //Delete cms
    $(document).on("click", ".delete-cms", function () {
      const cmsId = $(this).data("id");
      Swal.fire({
        title: "Are you sure?",
        text: "You will not be able to recover this cms!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          $.ajax({
            url: `/admin/cms/delete/${cmsId}`,
            method: "DELETE",
            success: function () {
              Swal.fire("Deleted!", "Cms has been deleted.", "success");
              table.ajax.reload(null, false);
            },
            error: function () {
              Swal.fire("Error!", "Failed to delete cms.", "error");
            },
          });
        }
      });
    });
  }
});
