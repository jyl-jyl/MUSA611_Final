/* eslint consistent-return: off */

$("form").keypress((e) => {
  if (e.keyCode === 13) {
    e.preventDefault();
    return false;
  }
});
