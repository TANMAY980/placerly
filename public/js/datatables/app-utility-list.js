"use strict";
$(function () {
  $(document).on("click", ".addUtilityModalBtn", function (e) {
  e.preventDefault();
  const type = $(this).data("type");

  $("#accounttype").val(type);

  const modal = new bootstrap.Modal(document.getElementById("addUtilityModal"));
  modal.show();
  });

  $(document).on("submit", "#addUtilityForm", function (e) {
  e.preventDefault();
  Swal.fire({
    title: "Are you sure?",
    text: "Do you want to add this utility account?",
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
        url: "/utility/add",
        type: "POST",
        data: {
          name: $("#utilityname").val(),
          accounttype: $("#utilityaccounttype").val(),
        },
        success: function () {
          $("#addUtilityModal").modal("hide");
          Swal.fire("Success", "Utility account added successfully", "success");
          table && table.ajax.reload(null, false);
        },
        error: function (xhr) {
          let msg = "Failed to add utility account";
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
