"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2024-10-09T00:23:18.575Z",
    "2024-10-12T00:23:18.575Z",
    "2024-10-13T00:23:18.575Z",
  ],
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const passedMomentPassed = function (dates) {
  const calcDayPassed = (date2, date1) => {
    return Math.round(Math.abs((date1 - date2) / (1000 * 60 * 60 * 24)));
  };
  const dayPassed = calcDayPassed(new Date(), dates);
  // console.log(dayPassed, "hii");
  if (dayPassed === 0) return `Today`;
  if (dayPassed === 1) return `Yesterday`;
  if (dayPassed <= 7) return `${dayPassed} days ago`;
  // else {
  //   const date = `${dates.getDate()}`.padStart(2, 0);
  //   const month = `${dates.getMonth()}`.padStart(2, 0);
  //   const year = dates.getFullYear();
  //   return `${date}/${month}/${year}`;
  // }
  const local = navigator.language;
  const option = {
    hour: "numeric",
    minute: "numeric",
    month: "long",
    day: "numeric",
    year: "numeric",
    weekday: "long",
  };
  return new Intl.DateTimeFormat(local).format(dates);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  // console.log(acc);
  movs.forEach(function (mov, i) {
    // console.log(acc.movementsDates[i]);

    const now = new Date(acc.movementsDates[i]);
    const local = navigator.language;
    const displayDates = passedMomentPassed(now);
    const formatNumbers = new Intl.NumberFormat(local, {
      style: "currency",
      currency: "EUR",
    }).format(mov);
    console.log(formatNumbers);
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `<div class="movements__row">
                <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
                 <div class="movements__date">${displayDates}</div>
                <div class="movements__value">${formatNumbers} </div>
            </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const createUserName = function (accounts) {
  accounts.forEach(function (account) {
    account.username = account.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUserName(accounts);
// console.log(accounts);

const calcBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} €`;
};

//update ui function that call all three fucntion
const updateUI = function (currentAccount) {
  displayMovements(currentAccount); //display movements
  calcBalance(currentAccount); //display top side total balances
  calcDisplaySummary(currentAccount); //display lower side all three balances
};
//for in label
const calcDisplaySummary = function (account) {
  const balance = account.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  const outGoing = account.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov);

  const intrest = account.movements
    .filter((mov) => mov > 0)
    .map((mov) => (mov * account.interestRate) / 100)
    .filter((mov) => mov >= 1)
    .reduce((acc, mov) => acc + mov);

  labelSumIn.textContent = `${balance} €`;
  labelSumOut.textContent = `${Math.abs(outGoing)} €`;
  labelSumInterest.textContent = `${Math.abs(intrest)} €`;
};

//date

//login functinality
let currentAccount;
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  // const now = new Date();
  // const day = now.getDay();
  // const date = `${now.getDate()}`.padStart(2, 0);
  // const month = `${now.getMonth()}`.padStart(2, 0);
  // const year = now.getFullYear();
  // const hour = `${now.getHours()}`.padStart(2, 0);
  // const minute = `${now.getMinutes()}`.padStart(2, 0);
  // const second = now.getSeconds();
  // labelDate.textContent = `${date}/${month}/${year}, ${hour}:${minute}`;
  // console.log("hii");
  const now = new Date();
  const local = navigator.language;
  const option = {
    hour: "numeric",
    minute: "numeric",
    month: "long",
    day: "numeric",
    year: "numeric",
    weekday: "long",
  };
  labelDate.textContent = new Intl.DateTimeFormat(local, option).format(now);
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;

    containerApp.style.opacity = 100;
    inputLoginUsername.value = "";
    inputLoginPin.value = "";
    inputLoginPin.blur();

    updateUI(currentAccount);
  }
});

//for transfer money
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverUser = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiverUser?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverUser.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverUser.movements.push(new Date().toISOString());
    updateUI(currentAccount);
  }
  inputTransferTo.value = "";
  inputTransferAmount.value = "";
  inputTransferAmount.blur();
});

//to add loan
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov > amount * 0.1)
  ) {
    currentAccount.movements.push(amount);
    inputLoanAmount.value = "";
    currentAccount.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);
  }
  inputLoanAmount.value = "";
});

//for delete the account
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  // console.log("this is the cirrent user");
  if (
    inputCloseUsername.value === currentAccount.username &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    // updateUI(currentAccount);
    containerApp.style.opacity = 0;
    inputCloseUsername.value = "";
    inputClosePin.value = "";
  }
});

//sorting button
let sortValue = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sortValue);
  sortValue = !sortValue;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ["USD", "United States dollar"],
//   ["EUR", "Euro"],
//   ["GBP", "Pound sterling"],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// for (const movement of movements) {
// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`Movement ${i + 1}: You deposite ${movement}`);
//   } else {
//     `Movement ${i + 1}: You withdraw ${Math.abs(movement)}`;
//   }
// }

//-------forEach loop-------------//forEach loop have no break condition so when we have to loop full array then only we have to use it
// console.log("--------forEach------------");
// movements.forEach(function (movement, i) {
//   if (movement > 0) {
//     console.log(`Movement ${i + 1}: You deposite ${movement}`);
//   } else {
//     `Movement ${i + 1}: You withdraw ${Math.abs(movement)}`;
//   }
// });

//----------Reduce method -------------------
// const max = movements.reduce((acc, mov) => {
//   if (acc > mov) {
//     return acc;
//   } else {
//     return mov;
//   }
// }, movements[0]);
// console.log(max);
