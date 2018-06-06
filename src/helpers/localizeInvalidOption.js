export function localizeInvalidOption(txt, intl) {
  let invalidOption = 'Invalid';
  if (txt === 'Invalid') {
    if (intl.locale.startsWith('zh')) {
      invalidOption = '无效';
    } else if (intl.locale.startsWith('ko')) {
      invalidOption = '무효의';
    }
  }
  return invalidOption;
}
