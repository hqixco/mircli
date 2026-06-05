function formatPhoneValue(rawValue) {
  const digits = rawValue.replace(/\D/g, '');
  const normalizedDigits = digits.startsWith('7') || digits.startsWith('8') ? digits.slice(1) : digits;
  const phoneDigits = normalizedDigits.slice(0, 10);

  if (!phoneDigits) {
    return '';
  }

  let output = '+7 (';

  output += phoneDigits.slice(0, 3);

  if (phoneDigits.length >= 3) {
    output += ') ';
  }

  if (phoneDigits.length > 3) {
    output += phoneDigits.slice(3, 6);
  }

  if (phoneDigits.length >= 6) {
    output += '-';
  }

  if (phoneDigits.length > 6) {
    output += phoneDigits.slice(6, 8);
  }

  if (phoneDigits.length >= 8) {
    output += '-';
  }

  if (phoneDigits.length > 8) {
    output += phoneDigits.slice(8, 10);
  }

  return output;
}

function applyPhoneMask(input) {
  const syncValue = () => {
    input.value = formatPhoneValue(input.value);
  };

  input.addEventListener('input', syncValue);
  input.addEventListener('paste', () => {
    window.requestAnimationFrame(syncValue);
  });
  input.addEventListener('blur', syncValue);
}

function initRequestFormMasks() {
  document.querySelectorAll(".request-form input[type='tel']").forEach((input) => {
    if (input instanceof HTMLInputElement) {
      applyPhoneMask(input);
    }
  });
}

initRequestFormMasks();
