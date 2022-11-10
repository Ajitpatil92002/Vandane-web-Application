/**
 * For usage, visit Chart.js docs https://www.chartjs.org/docs/latest/
 */

const fetchData = async () => {
  const res = await fetch("/admin/userstatus", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const datas = await res.json();
  console.log(datas);
  const userStatus = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  datas.forEach((data) => {
    // console.log(data);
    userStatus[data._id - 1] = data.total;
  });
  console.log(userStatus);
  const barConfig = {
    type: "bar",
    data: {
      labels: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      datasets: [
        {
          backgroundColor: "#0694a2",
          // borderColor: window.chartColors.red,
          borderWidth: 1,
          data: userStatus,
        },
      ],
    },
    options: {
      responsive: true,
      legend: {
        display: false,
      },
    },
  };

  const barsCtx = document.getElementById("bars");
  window.myBar = new Chart(barsCtx, barConfig);
};

fetchData();
