import {Wheel} from '../../../dist/spin-wheel-esm.js';
import * as easing from '../../../scripts/easing.js';

window.onload = () => {
  const container = document.querySelector('.wheel-wrapper');
  const dropdownWinningItem = document.querySelector('select.winning-item');
  const dropdownEasingFunction = document.querySelector(
    'select.easing-function'
  );
  const dropdownRevolutions = document.querySelector('select.revolutions');

  const btnSpin = document.querySelector('.gui-wrapper .btn-spin');
  const btnStop = document.querySelector('.gui-wrapper .btn-stop');

  const props = {
    debug: false, // So we can see pointer angle.
    items: [
      {
        label: '20k',
        weight: 1,
        trueWeight: 20,
        price: 20,
        backgroundColor: '#0070dd',
      },
      {
        label: '50k',
        weight: 1,
        trueWeight: 4,
        price: 50,
        backgroundColor: '#a335ee',
      },
      {
        label: '100k',
        weight: 1,
        trueWeight: 2,
        price: 100,
        backgroundColor: '#ff8000',
      },
      {
        label: '200k',
        weight: 1,
        trueWeight: 1,
        price: 200,
        backgroundColor: 'red',
      },
    ],
    itemLabelRadiusMax: 0.5,
  };

  let sum_of_weight = 0;
  props.items.forEach(element => {
    sum_of_weight += element.trueWeight;
  });

  const easingFunctions = [
    {
      label: 'default (easeSinOut)',
      function: null,
    },
    {
      label: 'easeSinInOut',
      function: easing.sinInOut,
    },
    {
      label: 'easeCubicOut',
      function: easing.cubicOut,
    },
    {
      label: 'easeCubicInOut',
      function: easing.cubicInOut,
    },
    {
      label: 'easeElasticOut',
      function: easing.elasticOut,
    },
    {
      label: 'easeBounceOut',
      function: easing.bounceOut,
    },
  ];

  window.wheel = new Wheel(container, props);

  // Initalise winning item dropdown:
  for (const [i, item] of wheel.items.entries()) {
    const opt = document.createElement('option');
    opt.textContent = item.label;
    opt.value = i;
    dropdownWinningItem.append(opt);
  }

  // Initalise easing functions dropdown:
  for (const [i, item] of easingFunctions.entries()) {
    const opt = document.createElement('option');
    opt.textContent = item.label;
    opt.value = i;
    dropdownEasingFunction.append(opt);
  }

  window.addEventListener('click', (e) => {
    // Listen for click event on spin button:
    if (e.target === btnSpin) {
      const winningItemIndex = fetchWinningItemIndexFromApi();

      let one = 0;
      let two = 0;
      let three = 0;
      let four = 0;
      for (let index = 0; index < 1000; index++) {
        const result = fetchWinningItemIndexFromApi() + 1;
        if (1 === result) one++;
        if (2 === result) two++;
        if (3 === result) three++;
        if (4 === result) four++;
      }
      console.log(one, two, three, four);


      const easing = easingFunctions[dropdownEasingFunction.value];
      const easingFunction = easing.function;
      const duration = 2600;
      const spinDirection = parseInt(
        document.querySelector('input[name="spinDirection"]:checked').value
      );
      const revolutions = parseInt(dropdownRevolutions.value);
      wheel.spinToItem(
        winningItemIndex,
        duration,
        true,
        revolutions,
        spinDirection,
        easingFunction
      );
    }

    // Listen for click event on stop button:
    if (e.target === btnStop) {
      wheel.stop();
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.target && e.target.matches('#pointerAngle')) {
      wheel.pointerAngle = parseInt(e.target.value) || 0;
    }
  });

  function fetchWinningItemIndexFromApi() {
    let rand = Math.floor(Math.random() * sum_of_weight);
    let result = 0; // Initialize a variable to hold the result
    for (let index = 0; index < props.items.length; index++) {
      const element = props.items[index];
      if (rand < element.trueWeight) {
        result = index; // Assign the price to result
        break; // Exit the loop once we find the matching element
      }
      rand -= element.trueWeight; // Decrease rand by the trueWeight
    }

    return result; // Return the result after the loop
  }
};
