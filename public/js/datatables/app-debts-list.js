"use strict";
$(function () {
  $(document).on("click", ".addDebtModalBtn", function (e) {
  e.preventDefault();
  const type = $(this).data("type");

  $("#accounttype").val(type);

  const modal = new bootstrap.Modal(document.getElementById("addDebtModal"));
  modal.show();
  });

  $(document).on("submit", "#addDebtForm", function (e) {
  e.preventDefault();
  Swal.fire({
    title: "Are you sure?",
    text: "Do you want to add this asset?",
    icon: "question",
    reverseButtons: true,
    showCancelButton: true,
    cancelButtonColor: "#d33",
    confirmButtonColor: "#3085d6",
    cancelButtonText: "Cancel",
    confirmButtonText: "Yes, add it!"
    
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: "/debt/create",
        type: "POST",
        data: {
          name: $("#debtname").val(),
          accounttype: $("#debtaccounttype").val(),
        },
        success: function () {
          $("#addDebtModal").modal("hide");
          Swal.fire("Success", "Debt account added successfully", "success");
          table && table.ajax.reload(null, false);
        },
        error: function (xhr) {
          let msg = "Debt account add failed";
          if (xhr.responseJSON && xhr.responseJSON.message) {
            msg = xhr.responseJSON.message;
          }
          Swal.fire("Error", msg, "error");
        }
      });

    }

  });
});

});
