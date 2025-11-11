"use strict";
$(function () {
  const dtBlogTable = $(".blog-list-table");
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
          url: `${window.location.protocol}//${window.location.host}/admin/blog/getall`,
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
          { data: "title", title: "Title" },
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
              "data-target": "#addBlogModal",
            },
          },
        ],
        language: {
          sLengthMenu: "Show _MENU_ entries",
          search: "Search",
          searchPlaceholder: "Search Blogs...",
          processing: "Loading...",
          zeroRecords: "No Bolgs Record found!",
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
                <button class="btn btn-sm btn-info view-blog" data-id="${data}">
                  <i class="bi bi-eye"></i> Details
                </button>
                <button class="btn btn-sm btn-primary edit-blog" data-id="${data}">
                  <i class="bi bi-pencil"></i> Edit
                </button>
                <button class="btn btn-sm btn-danger delete-blog" data-id="${data}">
                  <i class="bi bi-trash"></i>
                </button>`;
            },
          },
        ],
        order: [[4, "desc"]],
      });

    //  Reload on dropdown change
    statusDropdown.on("change", () => table.ajax.reload());

    $(document).on("click", ".view-blog", function () {
      const blogId = $(this).data("id");
      console.log(blogId);
      window.location.href = `/admin/blogdetails/${blogId}`;
    });
    // Status change modal
    $(document).on("click", ".status-badge", function () {
      const row = $(this).closest("tr");
      const blogId = row.find(".btn-primary").data("id");
      const currentStatus = $(this).text().trim();
      $("#selectedBlogId").val(blogId);
      $("#statusSelect").val(currentStatus);
      $("#statusModal").modal("show");
    });

    $("#confirmStatusChange").on("click", function () {
      const blogId = $("#selectedBlogId").val();
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
            url: `/admin/blog/statuschange/${blogId}`,
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

    //Add Blog modal button
    $(document).on("click", ".addBlogModalBtn", function () {
      $("#addBlogModal").modal("show");
    });

    //Add Blog
    $(document).on("submit", "#addBlogForm", function (e) {
      e.preventDefault();

      const formData = new FormData();

      const name = $("#Name").val();
      const title = $("#Title").val();
      const description = $("#description").val();
      const files = $("#coverImage")[0].files;

      formData.append("name", name);
      formData.append("title", title);
      formData.append("description", description);
      for (let i = 0; i < files.length; i++) {
        formData.append("coverImage", files[i]);
      }

      $.ajax({
        url: "/admin/blog/create",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
          $("#addBlogModal").modal("hide");
          $("#addBlogForm")[0].reset();
          Swal.fire("Created!", "Blog created successfully.", "success");
          table.ajax.reload(null, false);
        },
        error: function () {
          Swal.fire("Error!", "Failed to add blog", "error");
        },
      });
    });

    //Edit blog
    $(document).on("click", ".edit-blog", async function () {
      const blogId = $(this).data("id");
      try {
        $("#loader").show();

        const response = await fetch(`/admin/blog/jsondetails/${blogId}`);
        const result = await response.json();

        if (result.status && result.data) {
          const blog = result.data;

          $("#editBlogId").val(blog._id);
          $("#BlogName").val(blog.name || "");
          $("#BlogTitle").val(blog.title || "");
          $("#Blogdescription").val(blog.description || "");
          $("#editStatus").val(blog.status || "inactive");

          const modal = new bootstrap.Modal(
            document.getElementById("editBlogModal")
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

    // Update blog changes
    $(document).on("click", "#saveBlogChanges", function (e) {
      e.preventDefault();

      const blogId = $("#editBlogId").val();
      const formData = new FormData();
      console.log(formData);

      formData.append("name", $("#BlogName").val());
      formData.append("title", $("#BlogTitle").val());
      formData.append("description", $("#Blogdescription").val());
      formData.append("status", $("#editStatus").val());

      const files = $("#editCoverImage")[0].files;

      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          formData.append("coverImage", files[i]);
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
            url: `/admin/blog/update/${blogId}`,
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
              Swal.fire("Updated!", response.message, "success");
              $("#editBlogModal").modal("hide");
              table.ajax.reload(null, false);
            },
            error: function (xhr) {
              Swal.fire(
                "Error!",
                xhr.responseJSON?.message || "Failed to update blog",
                "error"
              );
            },
          });
        }
      });
    });

    //Delete blog

    $(document).on("click", ".delete-blog", function () {
      const blogId = $(this).data("id");
      Swal.fire({
        title: "Are you sure?",
        text: "You will not be able to recover this blog!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          $.ajax({
            url: `/admin/blog/delete/${blogId}`,
            method: "DELETE",
            success: function () {
              Swal.fire("Deleted!", "Blog has been deleted.", "success");
              table.ajax.reload(null, false);
            },
            error: function () {
              Swal.fire("Error!", "Failed to delete blog.", "error");
            },
          });
        }
      });
    });
  }
});
