'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovement = function (movements, sort = false) {
  containerMovements.textContent = '';
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const int = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
                <div class="movements__type movements__type--${int}">${
      i + 1
    } ${int}</div>
                <div class="movements__value">${mov}€</div>
                </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const updateUI = function () {
  calcDisplaySumary(currentAccount);
  displayBalance(currentAccount);
  displayMovement(currentAccount.movements);
};

const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(val => val.at(0))
      .join('');
  });
};
createUserName(accounts);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const displayBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (acc, cur) {
    return acc + cur;
  }, 0);
  labelBalance.textContent = `${acc.balance} €`;
};

const calcDisplaySumary = function (currentAcc) {
  const income = currentAcc.movements
    .filter(cur => cur > 0)
    .reduce((acc, cur) => acc + cur, 0);
  const outcome = currentAcc.movements
    .filter(cur => cur < 0)
    .reduce((acc, cur) => acc + cur, 0);
  const interest = currentAcc.movements
    .filter(cur => cur > 0)
    .map(cur => (cur * currentAcc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, cur) => acc + cur, 0);
  // console.log(movements.filter(cur => cur > 0));
  labelSumIn.textContent = `${income} €`;
  labelSumOut.textContent = `${Math.abs(outcome)} €`;
  labelSumInterest.textContent = `${interest} €`;
};

let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  // console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // console.log('LOGIN');
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    updateUI();
    containerApp.style.opacity = '1';
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur();
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiver = accounts.find(
    curEl => curEl.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    receiver &&
    currentAccount.balance >= amount &&
    receiver.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiver.movements.push(amount);
    updateUI();
    inputTransferTo.blur();
  }
});

// inputLoanAmount
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some(currEl => currEl >= amount * 0.1)
  ) {
    // console.log('Good you are valid now!');
    currentAccount.movements.push(amount);
    updateUI();
  }
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    console.log('HI');
    const index = accounts.findIndex(function (curr) {
      return curr.username === currentAccount.username;
    });
    accounts.splice(index, 1);
    containerApp.style.opacity = '0';
  }
  inputTransferAmount.value = inputTransferTo.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function () {
  // e.preventDefault();
  displayMovement(currentAccount.movements, !sorted);
  sorted = !sorted;
});

labelBalance.addEventListener('click', function () {
  const x = Array.from(document.querySelectorAll('.movements__value'), el =>
    Number(el.textContent.replace('€', ''))
  );
  console.log(x);
});

// const x = [10, 20, 30];
// const y = x.reduce(
// (acc, curr) => {
//   curr > 0 ? (acc.deposit = curr) : (acc.withdrawal = curr);
//   return acc;
// },
// { deposit: 0, withdrawal: 0 }
//   (acc, curr) => {
//     if (curr > acc) {
//       acc = curr;
//     } else {
//       acc = acc;
//     }
//     return acc;
//   },
//   x[0]
// );
// console.log(y);
// const red = accounts
//   .map(cur => cur.movements)
//   .flat()
//   .reduce((acc, curr) => (curr >= 1000 ? ++acc : acc), 0);
// console.log(red);
// const x = new Array(5);
// x.fill(3, 0, 2);
// console.log(x);

// const x = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(x);

// const arr = [1, 2, 3, 4];
// const x = new Array(...arr);
// x[1] = 10;
// console.log(x);
// console.log(arr);
// const x = [10, 20, 30];
// const y = x.slice();
// console.log(x, y);
// const x = [100, 200, 300, 400, -300, 5000, 700];
// const y = x.reduce(function (acc, mov, i) {
//   if (mov > acc) {
//     console.log(`Iteration ${i}: ${acc} and ${mov} If`);
//     return mov;
//   } else {
//     console.log(`Iteration ${i}: ${acc} Else`);
//     return acc;
//   }
// }, x[0]);
// console.log(y);

// const mov = [10, [20, 30], 40, 50];
// console.log(mov.flat(1).map(mov => mov + 10));
// console.log(mov.flatMap(mov => mov + 10));

// const xyz = [10, 20, 30, 40, 50];
// const r = xyz.findIndex(function (currEl) {
//   return currEl === 30;
// });
// console.log(xyz, r);
// btnClose
// inputCloseUsername
// inputClosePin
// inputTransferTo
// inputTransferAmount
// btnTransfer
// const euroToUsd = 1.1;
// const dollarConversion = function (euros) {
//   const totalDollar = euros
//     .filter(cur => cur > 0)
//     .map(cur => cur * euroToUsd)
//     .reduce((acc, cur) => acc + cur, 0);
//   console.log(`${totalDollar} $`);
// };
// dollarConversion(movements);
// const x = movements.filter(function (curr, i, arr) {
//   return curr > 0;
// });

// console.log(account1);

// const julia = [3, 5, 2, 12, 7];
// const kate = [4, 1, 15, 8, 3];
// const arr = [...julia.slice(1, 3), ...kate];

// const checkDog = function (age, num) {
//   if (age >= 3)
//     console.log(`Dog number ${num + 1} is an adult and is ${age} years old`);
//   else console.log(`Dog number ${num + 1} is still a Puppy`);
// };

// arr.forEach(checkDog);

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const x = movements.reduce(function (acc, curr, ind, arr) {
//   return acc + curr;
// }, 0);

// console.log(x);
// const deposit = movements.filter(function (mov) {
//   return mov > 0;
// });

// const withdrawal = movements.filter(function (mov) {
//   return mov < 0;
// });

// console.log(deposit);
// console.log(withdrawal);

// const x = new Map([
//   ['name', 'Praveen kumar'],
//   ['age', 23],
// ]);
// x.forEach(function (val, key) {
//   console.log(val + ' and the keys are ' + key);
// });
// const movementDescrition = movements.map(function (move, i) {
//   return `Movement ${
//     i + 1
//   }: You ${move > 0 ? 'deposited' : 'withdraw'} ${move} `;
// });
// console.log(movementDescrition);
// const eurtoUsd = 1.1;
// const usdCurrency = movements.map(mov => mov * eurtoUsd);
// console.log(usdCurrency);

// const x = movements.filter(function (mov) {
//   return mov > 0;
// });
// console.log(x);

// movements.forEach(function (value, index, arr) {
//   console.log(Math.abs(value), index);
// });

/////////////////////////////////////////////////

// const arr = [10, 20, 30, 40];
// console.log(arr.slice(1, 4));
// console.log(arr);
// console.log(arr.splice(-1));
// console.log(arr);
// console.log(arr.at(-1));
// console.log(arr);
// console.log(arr.reverse());

// const calculateHumanAge2 = function (dogAge) {
//   const humanAge = dogAge.map(cur => (cur <= 2 ? 2 * cur : 16 + cur * 4));
//   console.log(humanAge);
//   const adults = humanAge.filter(cur => cur > 18);
//   const average = adults.reduce((acc, cur) => acc + cur, 0) / adults.length;
//   console.log(average);
// };

// const calculateHumanAge = dogAge =>
//   dogAge
//     .map(cur => (cur <= 2 ? 2 * cur : 16 + cur * 4))
//     .filter(cur => cur > 18)
//     .reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

// console.log(calculateHumanAge([5, 2, 4, 1, 15, 8, 3]));
