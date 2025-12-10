"use strict";
$(function () {
  //Executor
  $(document).on("click", ".addExecutorModalBtn", function (e) {
  e.preventDefault();
  const modal = new bootstrap.Modal(document.getElementById("addExecutorModal"));
  modal.show();
  });
  //add Executor
  $(document).on("submit", "#addExecutorForm", function (e) {
  e.preventDefault();
  Swal.fire({
    title: "Are you sure?",
    text: "Do you want to add this executor?",
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
        url: "/transition/executor/add",
        type: "POST",
        data: {
          name: $("#executorname").val(),
          email: $("#executoremail").val(),
          phone:$("#executorphone").val()
        },
        success: function () {
          $("#addExecutorModal").modal("hide");
          $("#addBeneficiaryForm")[0].reset();
          Swal.fire("Success", "Executor details added successfully", "success");
          table && table.ajax.reload(null, false);
        },
        error: function (xhr) {
          let msg = "Failed to add Executor details";
          if (xhr.responseJSON && xhr.responseJSON.message) {
            msg = xhr.responseJSON.message;
          }
          Swal.fire("Error", msg, "error");
        }
      });

    }

  });
});
//Beneficiary
$(document).on("click", ".addBeneficiaryModalBtn", function (e) {
  e.preventDefault();
  const modal = new bootstrap.Modal(document.getElementById("addBeneficiaryModal"));
  modal.show();
});
//add Beneficiary
$(document).on("submit", "#addBeneficiaryForm", function (e) {
  e.preventDefault();
  Swal.fire({
    title: "Are you sure?",
    text: "Do you want to add this beneficiary?",
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
        url: "/transition/beneficiary/add",
        type: "POST",
        data: {
          name: $("#Beneficiaryname").val(),
          email: $("#Beneficiaryemail").val(),
          phone:$("#Beneficiaryphone").val()
        },
        success: function () {
          $("#addBeneficiaryModal").modal("hide");
          $("#addBeneficiaryForm")[0].reset();
          Swal.fire("Success", "Beneficiary details added successfully", "success");
          table && table.ajax.reload(null, false);
        },
        error: function (xhr) {
          let msg = "Failed to add Beneficiary details";
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
